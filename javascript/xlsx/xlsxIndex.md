
```javascript
const xlsxN2C = (xlsxIndex) => {
    function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }

    if( xlsxIndex < 26 ) {
        return String.fromCharCode(xlsxIndex + 65)
    } else {
        let tmp = getBaseLog(26,xlsxIndex);
        let endIndex = Math.floor(tmp);
        let textLength = Math.ceil(tmp)
        let num = xlsxIndex + 0;

        console.log("endIndex", endIndex)
        console.log("textLength", textLength)

        /*
        17576 
        */

        for(let i=0;i<endIndex;i++) {

        }

        //console.log( xlsxIndex // 26 )
        return '' //String.fromCharCode(n)
    }
}

const xlsxC2N = (abcIndex) => {
    const textLength = abcIndex.length
    const endIndex = textLength - 1
    const rtn = new Array(textLength).fill(0);

    let n = 0

    for(let i=0; i<endIndex ; i++) {
        n = (abcIndex.codePointAt(i) - 65 + 1) * (26**(endIndex-i))
        console.log(`${i} n = (abcIndex.codePointAt(i) - 65 + 1) * (26**(endIndex-i)) => ${n} = (abcIndex.codePointAt(${i}) - 65 + 1) * (26**(${endIndex}-${i}))`)
        rtn.push(n)
    }

    rtn.push(abcIndex.codePointAt(endIndex) - 65)

    let initialValue = 0;
    return rtn.reduce( (accumulator, currentValue) => accumulator + currentValue, initialValue, );
}

const ASCIIs = [
    'A',
    'AA',
    'AAA',
    'AAAA',
];

ASCIIs.forEach((v)=>{
    let n1 = xlsxC2N(v)
    let n2 = xlsxN2C(n1)
    console.log(`${v} = ${n1} , ${n2}`)
})

// public static int getAbc2Int(String str) {
//     int idx = 0;
//     if (str != null) {
//         int len = str.length();
//         switch (len) {
//             case 1:
//                 int n = str.charAt(0) + 0;
//                 idx = n - 65;
//                 break;
//             case 2:
//                 int n1 = str.charAt(0) + 0;
//                 int n2 = str.charAt(1) + 0;
//                 int a1 = (n1 - 65 + 1) * 26;
//                 idx = (n2 - 65) + a1;
//                 break;
//         }
//     }
//     return idx;
// }
```
