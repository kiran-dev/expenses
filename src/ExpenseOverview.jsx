import { useEffect, useState, useRef } from 'react'

export default function ExpenseOverview(props) {

  const [expensesCount, setExpensesCount] = useState(0);
  const [expensesTotal, setExpensesTotal] = useState(0);

  useEffect(() => {
    let expCount = 0;
    let expTotal = 0;
    for (const exp of props.expenses) {
      expTotal = expTotal + exp.amount;
      expCount++;
    }
    setExpensesCount(expCount);
    setExpensesTotal(expTotal);
  }, [props.expenses])

  return (
    <div className={`w-full grid sm:grid-flow-col grid-flow-row justify-items-center sm:justify-between mb-10 ${props.theme === "light" ? "text-black" : "text-white"}`}>
      <div className='grid grid-flow-row justify-start text-inherit'>
        <p className='text-2xl text-inherit'>Number of Expenses:</p>
        <span className='text-center text-4xl text-inherit'>{expensesCount}</span>
      </div>
      <div className='grid grid-flow-row justify-start text-inherit'>
        <p className='text-2xl text-inherit'>Total Expenses:</p>
        <span className='text-center text-4xl text-inherit'>{expensesTotal}</span>
      </div>
    </div>
  )
}