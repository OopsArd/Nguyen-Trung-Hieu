<h3>List out the computational inefficiencies and anti-patterns found in the code block below</h3>

<h5>1/"lhsPriority" is not defined and "blockchain" property not defined in "WalletBalance"</h5>

```TypeScript
return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}
```
<h5>FIX-1: Add "blockchain" property</h5>

```TypeScript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
```
<h5>FIX-2: Change "sortedBalances" to:</h5>

```TypeScript
const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount <= 0;
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
  }, [balances, getPriority]);
```

<h5>2/ The function "getPriority" is called multiple times during sorting and filtering of the balance list. This could lead to poor performance, especially with large balance lists </h5>

```TypeScript
const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}
```
<h5>UPDATE: Use useMemo to calculate once and reuse the getPriority function every time the balance list or priority values change</h5>

```TypeScript
  const getPriority = useMemo(() => {
    const priorityMap = {
      'Osmosis': 100,
      'Ethereum': 50,
      'Arbitrum': 30,
      'Zilliqa': 20,
      'Neo': 20,
    };
    return (blockchain: string) => priorityMap[blockchain] ?? -99;
  }, []);
```

<h5>3/ Instead of performing two separate map operations to create "formattedBalances" and "rows", both steps are combined into a single map operation, thus enhancing performance and readability of the code.</h5>

```TypeScript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```

<h5>UPDATE: Both "formattedBalances" and "rows" are now memoized using "useMemo". This helps optimize performance by avoiding unnecessary recalculations on each render when the dependencies remain unchanged</h5>

```TypeScript
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);
```

<h5>4/ UPDATE: use "extends"</h5>

```TypeScript
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```



