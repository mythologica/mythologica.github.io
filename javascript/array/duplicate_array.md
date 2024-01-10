# duplicate value in array 

```javascript
let data = [
    { a: 1, b: 'title1', c: 'work1' },
    { a: 1, b: 'title1', c: 'work1' },
    { a: 2, b: 'title2', c: 'work2' },
    { a: 3, b: 'title3', c: 'work3' },
    { a: 4, b: 'title4', c: 'work4' },
    { a: 5, b: 'title5', c: 'work5' },
    { a: 5, b: 'title5', c: 'work5' },
    { a: 6, b: 'title6', c: 'work6' },
    { a: 6, b: 'title6', c: 'work6' },
    { a: 7, b: 'title7', c: 'work7' },
    { a: 8, b: 'title8', c: 'work8' },
];

const getDuplicateValueIndex = (_array, _columns) => {
    let dumiArray1 = [..._array].map((value,index) => ({...value,ROW_NUM:index}))
    const mergeValues = (item, columns) => {
        let dupKey = [];
        columns.forEach((column) => {
            dupKey.push(item[column])
        })
        return dupKey.join('<>')
    }
    let rtnIndex = [];
    while(dumiArray1.length) {
        let checkItem = dumiArray1.shift();
        dumiArray1.forEach((item)=>{
            if( mergeValues( checkItem, _columns) === mergeValues( item , _columns) ) {
                rtnIndex.push(checkItem.ROW_NUM)
                rtnIndex.push(item.ROW_NUM)
            }
        })
    }
    return rtnIndex
}

const getDuplicateValueItem = (_array, _columns) => {
    let idxs = getDuplicateValueIndex(_array, _columns)
    let rtn = [];
    idxs.forEach((rowIndex)=>{
        rtn.push(_array[rowIndex])
    })
    return rtn
}

console.log('getDuplicateValueIndex', getDuplicateValueIndex(data, ['a', 'b']))
console.log('getDuplicateValueItem', getDuplicateValueItem(data, ['a', 'b']))
console.log('data', data)
```


