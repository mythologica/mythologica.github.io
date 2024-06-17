const commUtils = {};

commUtils.convertDate = function (_dateString, _sourceFormat, _targetFormat) {
    const MONTH_F_NAMES = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const MONTH_S_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    let result = {
        isDate: true,
        date: null,
        format: null,
        unformat: null,
    };

    const n2d = (__v, __d) => {
        return __v !== undefined && __v !== null && Number(__v) !== NaN ? Number(__v) : Number(__d);
    };

    let dt;
    let yyyy = -1
    let mm = -1
    let dd = -1
    let hh = 0
    let mi = 0
    let ss = 0
    let year = '';
    let month = '';
    let date = '';

    if (_sourceFormat === 'm/d/yyyy') {
        let tmpDt = _dateString.split("/");
        if (tmpDt.length !== 3) {
            result.isDate = false;
            return result
        }

        yyyy = n2d(tmpDt[2], -1);
        mm = n2d(tmpDt[0], -1);
        dd = n2d(tmpDt[1], -1);

        if (yyyy === -1 || mm === -1 || dd === -1) {
            result.isDate = false;
            return result
        }
    }

    year = `${yyyy}`;
    month = `${mm}`.padStart(2, '0');
    date = `${dd}`.padStart(2, '0');
    dt = new Date(yyyy, mm - 1, dd, 12, 1, 0);

    // 긴 날짜 서식에 더해 요일 요청
    var options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };

    console.log(new Intl.DateTimeFormat('ko-KR', options).format(dt))
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    console.log(Intl.DateTimeFormat().resolvedOptions().locale)


    result.date = dt;
    result.unformat = `${year}${month}${date}`;
    result.format = `${_targetFormat}`.replace(/(yyyy|mm|dd|HH|hh|mi|ss|TT|tt)/g, function ($1) {
        switch ($1) {
            case "yyyy": return `${yyyy}`;
            case "mm": return `${mm}`.padStart(2, '0');
            case "dd": return `${dd}`.padStart(2, '0');
            case "HH": return `${hh}`.padStart(2, '0'); //gf.zlpad(d.getHours(), 2);
            case "hh": return `${hh > 12 ? hh - 12 : hh}`.padStart(2, '0');
            case "TT": return hh > 12 ? "PM" : "AM";
            case "tt": return hh > 12 ? 'pm' : 'am';
            case "mi": return `${mi}`.padStart(2, '0');
            case "ss": return `${ss}`.padStart(2, '0');
            default: return $1;
        }
    });

    return result
}

const rs = commUtils.convertDate('6/17/2024', 'm/d/yyyy', 'yyyymmdd')
console.log(rs)
