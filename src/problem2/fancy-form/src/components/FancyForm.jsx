import React, { useEffect, useState } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { data } from '../../db'

import './fancy.css'

const FancyForm = () => {
    const [list, setList] = useState();
    const [currency, setCurrency] = useState();
    const [targetCurrency, setTarget] = useState();

    const [amountToSend, setSending] = useState('');
    const [receiving, setReceiving] = useState();

    const [err, setErr] = useState();

    useEffect(() => {
        const DATA_FROM_API = data.map((item,key) => {
            return {label: item.currency, key: key}
        });
        setList(DATA_FROM_API)
    }, [])

    const handleSelectCurrency = (e) => {
        const itemSelected = list.filter((item) => item.key == e.key)
        setCurrency(itemSelected[0].label);
    }

    const handleSelectTarget = (e) => {
        const itemSelected = list.filter((item) => item.key == e.key)
        setTarget(itemSelected[0].label);
    }

    const handleAmountToSend = (e) => {
        setSending(e.target.value)
    }

    const swapCurrencyClick = () => {
        if(!currency || !targetCurrency){
            alert("Select currency before swap!!!")
            return
        }
        if(amountToSend <= 0 || !amountToSend){
            alert("Input amount to send before swap!!!")
            return
        }

        const valueOfCurrency = data.filter(item => item.currency == currency)
        const valueOfTarget = data.filter(item => item.currency == targetCurrency)

        // Use dollar(USD) as an intermediary
        // trans amount currency to dollar  
        let currencyToUSD = amountToSend * valueOfCurrency[0].price;
        // use that doller to trans back target
        let usdToTarget = currencyToUSD / valueOfTarget[0].price

        setReceiving(usdToTarget);

    }

    return (
        <form className='w-2/5 h-3/4 max-h-2/3 flex flex-col justify-evenly items-center bg-white rounded-xl relative top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
            <div className='text-4xl'>Swap Form</div>
            <div className="w-3/4 flex justify-between">
                <div>
                    <span>From: </span>
                    <Dropdown 
                        menu={{
                            onClick: handleSelectCurrency,
                            items: list
                        }} 
                        trigger={['click']}
                        className='border-2 border-stone-600 rounded-xl p-1'
                    >
                        <Space>
                            {currency ? currency : 'Select currency'}
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </div>
                <div>
                    <span>to: </span>
                    <Dropdown 
                        menu={{
                            onClick: handleSelectTarget,
                            items: list
                        }} 
                        trigger={['click']}
                        className='border-2 border-stone-600 rounded-xl p-1'
                    >
                        <Space>
                            {targetCurrency ? targetCurrency : 'Select currency'}
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </div>
            </div>
            <div className='flex flex-col gap-1 w-3/4 justify-center'>
                <span>Amount to send: </span>
                <input value={amountToSend} onChange={handleAmountToSend} className='border-2 border-stone-600 rounded-sm pl-1' type="number" name="amount-to-send" id="amount-to-send" required />
                <div className='text-xs leading-none align-top italic pt-1'>Input number only</div>
            </div>
            <div className='flex flex-col gap-1 w-3/4'>
                <span>Amount to receive: </span>
                <input className={`rounded-sm p-1 text-white ${receiving ? 'bg-emerald-500' : ''}`} type="text" name="amount-to-receive" id="amount-to-receive" disabled value={receiving ? `${receiving} ${targetCurrency}`: ''} />
            </div>

            <button type='button' className='border-none rounded-sm p-2 w-3/4 bg-black text-white' onClick={swapCurrencyClick}>CONFIRM SWAP</button>
        </form>
    )
}

export default FancyForm