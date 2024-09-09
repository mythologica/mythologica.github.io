# array for break continue

```javascript
const list = [
  {id:1, title:'title1'},
  {id:2, title:'title2'},
  {id:3, title:'title3'},
  {id:4, title:'title4'},
  {id:5, title:'title5'},
]

for( const [idx,val] of list.entries() ) {
  if( idx === 1 ) continue;
  if( idx === 2 ) break;
  console.log('index',idx);
  console.log('value',val);
}
```
