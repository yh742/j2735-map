const compare = (a,b) => {
    var primitive=['string','number','boolean'];
    if(primitive.indexOf(typeof a)!==-1 && primitive.indexOf(typeof a)===primitive.indexOf(typeof b)) return a===b;
    if(typeof a!==typeof b || a.length!==b.length) return false;
    for(let i in a){
         if(!compare(a[i],b[i])) return false;
    }
    return true;
}

export default compare;