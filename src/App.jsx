import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList';
import ExpenseOverview from './ExpenseOverview';
import { createRxDatabase } from 'rxdb';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
 
const db = await createRxDatabase({
  name: 'expenses',                   // <- name
  storage: getRxStorageLocalstorage(),       // <- RxStorage
  password: 'myPassword',             // <- password (optional)
  multiInstance: true,                // <- multiInstance (optional, default: true)
  eventReduce: true,                  // <- eventReduce (optional, default: false)
  cleanupPolicy: {}                   // <- custom cleanup policy (optional) 
});

await db.addCollections({
    // name of the collection
    expenses: {
        // we use the JSON-schema standard
        schema: {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    maxLength: 100 // <- the primary key must have maxLength
                },
                name: {
                    type: 'string'
                },
                amount: {
                    type: 'number'
                },
                category: {
                  type: 'string'
                },
                createdAt: {
                    type: 'number'
                }
            },
            required: ['id', 'name', 'amount', 'category', 'createdAt']
        }
    }
});

await db.addCollections({
    // name of the collection
    theme: {
        // we use the JSON-schema standard
        schema: {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    maxLength: 100 // <- the primary key must have maxLength
                },
                mode: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'number'
                }
            },
            required: ['id', 'mode', 'updatedAt']
        }
    }
});

async function fetchExpensesFromDB() {
  const foundDocuments = await db.expenses.find({selector: {}}).exec();
  const expenses = [];
  for(const document of foundDocuments) {
    expenses.push({...document._data});
  }
  return expenses;
}

async function fetchThemeFromDB() {
  const foundDocuments = await db.theme.find({selector: {}}).exec();
  const theme = foundDocuments[0];
  return theme;
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    async function fetchData() {
      const fetchedExpenses = await fetchExpensesFromDB();
      setExpenses(fetchedExpenses);
    }
    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      let fetchedTheme = await fetchThemeFromDB();
      if (!fetchedTheme) {
        await db.theme.insert({
          id: Date.now().toString(),
          mode: "light",
          updatedAt: Date.now()
        });
        fetchedTheme = await fetchThemeFromDB();
      }
      setTheme(fetchedTheme.mode);
    }
    fetchData();
  }, [])

  const addNewExpense = useCallback(async (newExpense) => {
    setExpenses([...expenses, newExpense]);
    await db.expenses.insert(newExpense);
  })

  const deleteExpense = useCallback(async (deleteID) => {
    let otherExpenses = [];
    for (const expense of expenses) {
      if (expense.id === deleteID) continue;
      else otherExpenses.push(expense);
    }
    setExpenses(otherExpenses);
    const foundDocuments = await db.expenses.find({
      selector: {
        id: {
          $eq: deleteID
        }
      }
    }).exec();
    const deleteDocument = foundDocuments[0];
    await deleteDocument.remove();
  })

  const toggleTheme = useCallback(async () => {
    let newTheme;
    if (theme === "light") newTheme = "dark";
    else newTheme = "light";
    setTheme(newTheme);
    const foundDocuments = await db.theme.find({selector: {}}).exec();
    const firstDocument = foundDocuments[0];
    await firstDocument.patch({ mode: newTheme });
  })

  return (
    <div className={`w-full h-[100vh] overflow-y-scroll grid grid-flow-row items-start content-start justify-center ${ theme === "light" ? "bg-white" : "bg-black" }`}>
      <ExpenseOverview expenses={expenses} theme={theme}/>
      
      <ExpenseForm addNewExpense={addNewExpense} theme={theme}/>
      
      <ExpenseList expenses={expenses} deleteExpense={deleteExpense} theme={theme}/>

      <div className={`mt-10 w-40 justify-self-center text-center px-4 py-2 cursor-pointer border-4 bg-${theme === "light" ? "black" : "white"} text-${theme==="light" ? "white" : "black"}`} onClick={toggleTheme}>
        {`Switch to ${theme === "light" ? "DARK" : "LIGHT"}`}
      </div>      
    </div>
  )
}

export default App
