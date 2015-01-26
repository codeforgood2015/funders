//Credited to: http://css-tricks.com/snippets/javascript/format-currency/

function CurrencyFormatted(amount) {
    amount = amount.toString();
    if (amount == "") {
        return "";
    }

    amount = amount.replace(/[^0-9.]/g, "");
    

    var i = parseFloat(amount);
    if (isNaN(i)) {
        i = 0;
    }
    var minus = "";
    if (i < 0) {
        minus = "-";
    }
    i = Math.abs(i);
    i = parseInt((i + 0.005) * 100);
    i = i / 100;
    s = new String(i);
    if (s.indexOf(".") < 0) {
        s += ".00";
    }
    if (s.indexOf(".") == (s.length - 2)) {
        s += "0";
    }
    s = minus + s;
    return s;
}
