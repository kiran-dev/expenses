import { useEffect, useState, useRef } from 'react'

export default function ExpenseForm(props) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const nameRef = useRef();
  
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState(false);

  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  }, [])

  function addExpense() {
    if (!name) setNameError(true);
    if (amount <= 0) setAmountError(true);
    if (!category) setCategoryError(true)

    if (!name || amount <= 0 || !category) return;
  
    setNameError(false);
    setAmountError(false);
    setCategoryError(false);
    props.addNewExpense({
      id: Date.now().toString(),
      name: name,
      amount: Number(amount),
      category: category,
      createdAt: Date.now()
    });
    setName("");
    setAmount(0);
    setCategory("");
  }

  return (
    <div className={`grid grid-flow-row gap-2 justify-items-center sm:grid-flow-col sm:gap-8 sm:justify-items-between mb-10 
                    ${ props.theme === "light" ? "text-black border-black" : "text-white border-white"}`}>
      <div className='grid grid-flow-row gap-1 justify-items-start relative text-inherit border-inherit'>
        <p className='text-inherit border-inherit'>Name:</p>
        <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} type="text" className='w-28 border-2 text-inherit border-inherit'/>
        {
          nameError && <span className='text-red-400 absolute top-full'>Mandatory!</span>
        }
      </div>
      <div className='grid grid-flow-row gap-1 justify-items-start relative text-inherit border-inherit'>
        <p className='text-inherit border-inherit'>Amount:</p>
        <input value={amount} onChange={(e) => setAmount(Number(e.target.value))} type="number" className='w-28 border-2 text-inherit border-inherit'/>
        {
          amountError && <span className='text-red-400 absolute top-full'>Mandatory!</span>
        }
      </div>
      <div className='grid grid-flow-row gap-1 justify-items-start relative text-inherit border-inherit'>
        <p className='text-inherit border-inherit'>Category:</p>
        <select type="select" className={`w-28 border-2 text-inherit border-inherit ${props.theme === "light" ? "bg-white" : "bg-black"}`} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value=""></option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Others">Others</option>
        </select>
        {
          categoryError && <span className='text-red-400 absolute top-full'>Mandatory!</span>
        }
      </div>
      <button className='cursor-pointer max-w-40 border-4 px-4 text-inherit border-inherit' onClick={() => addExpense()}>Add Expense</button>
    </div>
  );
}