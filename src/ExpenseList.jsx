import { useEffect, useState } from 'react'

const UKFormatter = new Intl.DateTimeFormat('en-GB');

export default function ExpenseList(props) {

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("")
  const [displayExpenses, setDisplayExpenses] = useState([]);

  useEffect(() => {
    let finalExpenses = [];
    for (const expense of props.expenses) {
      if (!!searchText && !expense.name.includes(searchText)) continue;
      if (!!filterCategory && expense.category !== filterCategory) continue;
      finalExpenses.push(expense)
    }
    setDisplayExpenses(finalExpenses);
  }, [searchText, filterCategory, props.expenses])

  return (
    <>
      <div className={`mt-4 grid grid-flow-row gap-2 sm:grid-flow-col sm:gap-10 justify-center ${ props.theme === "light" ? "text-black border-black" : "text-white border-white" }`}>
        <div className='text-inherit border-inherit'>  
          <span className='mr-2'>Search By Name:</span>
          <input className='border-2 text-inherit border-inherit' type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
        </div>
        <div className='text-inherit border-inherit'>
          <span className='mr-2'>Filter By Category:</span>
          <select type="select" className={`w-28 border-2 text-inherit border-inherit ${props.theme === "light" ? "bg-white" : "bg-black"}`} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
      <div className={`mt-2 ${ props.theme === "light" ? "text-black border-black" : "text-white border-white" }`}>
        {
          displayExpenses.map((e) => (
            <div key={e.id} className='expense-row grid grid-flow-col w-full border-2 border-gray-400 text-inherit border-inherit'>
              <span className='max-w-40'>{e.name}</span>
              <span className='max-w-10'>{e.amount}</span>
              <span>{e.category}</span>
              <span>{UKFormatter.format(new Date(e.createdAt))}</span>
              <span className='cursor-pointer' onClick={() => props.deleteExpense(e.id)}>Delete</span>
            </div>
          ))
        }
      </div>
    </>
  )
}