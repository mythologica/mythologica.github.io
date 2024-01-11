# duplicate value in array 
1. 배열의 키중 a, b의 값이 중복된 것을 뽑아서 반환하는 메소드 입니다.


```javascript

let data = [
    { a: 1, b: 'title1', c: 'work1' },
    { a: 1, b: 'title1', c: 'work1' },
    { a: 2, b: 'title2', c: 'work2' },
    { a: 3, b: 'title3', c: 'work3' },
    { a: 4, b: 'title4', c: 'work4' },
    { a: 5, b: 'title5', c: 'work5' },
    { a: 5, b: 'title5', c: 'work5' },
    { a: 5, b: 'title5', c: 'work5' },
    { a: 6, b: 'title6', c: 'work6' },
    { a: 6, b: 'title6', c: 'work6' },
    { a: 7, b: 'title7', c: 'work7' },
    { a: 8, b: 'title8', c: 'work8' },
];

const getDuplicateValueIndex = (_array, _columns) => {
    let rtnIndex = [];
    if( _columns && _columns.length ) {
        let dumiArray1 = [..._array||[]].map((value,index) => ({...value,ROW_NUM:index}))
        
        const mergeValues = (item, columns) => {
            let dupKey = [];
            columns.forEach((column) => {
                dupKey.push(item[column])
            })
            return dupKey.join('<>')
        }
        
        let dupIdx = {}
        
        while(dumiArray1.length) {
            let checkItem = dumiArray1.shift();
            dumiArray1.forEach((item)=>{
                if( mergeValues( checkItem, _columns) === mergeValues( item , _columns) ) {
                    dupIdx[checkItem.ROW_NUM] = true
                    dupIdx[item.ROW_NUM] = true
                }
            })
        }

        for(const [key,value] of Object.entries(dupIdx)) {
            rtnIndex.push(Number(key))
        }
    }
    return rtnIndex.sort((a,b)=>a-b)
}

const getDuplicateValueItem = (_array, _columns) => {
    let idxs = getDuplicateValueIndex(_array, _columns)
    let rtn = [];
    idxs.forEach((rowIndex)=>{
        rtn.push(_array[rowIndex])
    })
    return rtn
}

const getDuplicateValueRows = ( _array , _columns , _primaryKeys ) => {
    let rtn = {
        primaryKeys:[],
        indexs:[],
        rows:[],
    }

    rtn.indexs = getDuplicateValueIndex(_array,_columns)

    if(_primaryKeys && _primaryKeys.length ) {
        rtn.indexs.forEach((rowIndex)=>{
            let row = {..._array[rowIndex]}
            rtn.rows.push(row)
            let rowPk = {}
            _primaryKeys.forEach((pk)=>{
                rowPk[pk]= row[pk]
            })
            rtn.primaryKeys.push({...rowPk})
        })
    } else {
        rtn.indexs.forEach((rowIndex)=>{
            let row = {..._array[rowIndex]}
            rtn.rows.push(row)
        })
    }
    return rtn;   
}

console.log('getDuplicateValueItem', getDuplicateValueItem(data, null))
console.log('getDuplicateValueItem', getDuplicateValueItem(null, ['a', 'b']))
console.log('getDuplicateValueItem', getDuplicateValueItem(data, ['a', 'b']))
console.log('getDuplicateValueIndex', getDuplicateValueIndex(data, ['a', 'b']))
console.log('data', data)
```


