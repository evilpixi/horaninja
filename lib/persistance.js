class STORE {}

STORE.debug = false // DATA.debug

STORE.save = (key,value) => {
    localStorage.setItem(key,value)
    if (STORE.debug) console.log("saved: ", key, value)
}
STORE.load = (key) => {
    let ret = null
    ret = localStorage.getItem(key)
    if (STORE.debug) console.log("loaded: ", key, ret)
    return ret
}
STORE.remove = (key) => {
    localStorage.removeItem(key)
    if (STORE.debug) console.log("removed: ", key)
}


STORE.aSave = (key, value) => {
    return new Promise((res, rej)=> {
        setTimeout( ()=> {
            res(localStorage.setItem(key, value))
            if (STORE.debug) console.log("saved: ", key, value)
        }, 1500)
    })
}
STORE.aLoad = (key) => {
    return new Promise((res, rej)=> {
        setTimeout( ()=> {
            res(localStorage.getItem(key))
            if (STORE.debug) console.log("loaded: ", key, ret)
        }, 1500)
    })
}
STORE.aRemove = (key) => {
    return new Promise((res, rej)=> {
        setTimeout( ()=> {
            res(localStorage.removeItem(key))
            if (STORE.debug) console.log("removed: ", key)
        }, 1500)
    })
}

STORE.loadSiteProgress = () => {
    Object.values(DATA.levelData).forEach((level, i) => {
        let index = i+1
        let bonus1 = STORE.load("level_" + index + "_" + level.bonuses[0].type)
        if (bonus1 == null) {
            bonus1 = 0
            STORE.save("level_" + index + "_" + level.bonuses[0].type, bonus1)
        }
        let bonus2 = STORE.load("level_" + index + "_" + level.bonuses[1].type)
        if (bonus2 == null) {
            bonus2 = 0
            STORE.save("level_" + index + "_" + level.bonuses[1].type, bonus1)
        }
        
        DATA.siteProgress["level-" + index + "_" + level.bonuses[0].type] = bonus1
        DATA.siteProgress["level-" + index + "_" + level.bonuses[1].type] = bonus2
    })
}

STORE.loadGameProgress = () =>{
    let progressVariables = [
        "available", "stars", "fruits", "score", "characters"
    ]
    for (let i=1; i<=10; i++) {
        DATA.progress["level-"+i] = {}
        progressVariables.forEach(v => {
            let value = STORE.load("level_"+i+"_"+v)
            if (value == null) {
                value = (i == 1 && v == "available" ) ? 1 : 0
                STORE.save("level_"+i+"_"+v, value)
            }
            DATA.progress["level-"+i][v] = value
        })
    }
}


/*STORE.aSave = (key, value)=> { new Promise((res, rej) => 
    res => {
        let ret = null
        setTimeout(()=>{
            ret = localStorage.setItem(key, value)
        }, 3000)
        
        return ret
        if (STORE.debug) console.log("saved: ", key, value)
    }, 
    rej => {
        console.error("can't save")
    }
)}
STORE.aLoad = (key)=> { new Promise(
    let
    res => {
        setTimeout(()=>{
            localStorage.getItem(key, value)
        }, 3000)
        
        if (STORE.debug) console.log("loaded: ", key, value)
    }, 
    rej => {
        console.error("can't load")
    }
)}
*/