let vol_label = document.getElementById("vol_label");
let vol_range = document.getElementById("vol_range");

const update_ui = () => {
    let saved_tabs = localStorage.getItem("tabsVolList");

    if (saved_tabs) {
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            JSON.parse(saved_tabs).forEach((tab) => {
                if (tab[0] == tabs[0].id) {
                    console.log(tab[1]);
                    vol_label.innerHTML = "Volume / " + (Number(tab[1]) * 100).toFixed() + "%";
                    vol_range.value = tab[1];
                    return;
                }
    
            });
        });

        
    }

} 

update_ui();

const set_tabs_volumes = (tabId, vol) => {
    tabs = localStorage.getItem("tabsVolList");

    if (tabs) {
        tabs = JSON.parse(tabs);
        let changed = false;
        tabs.forEach((tab) => {
            if (tab[0] == tabId) {
                tab[1] = vol;
                changed = true;
                localStorage.setItem("tabsVolList", JSON.stringify(tabs));
                console.log("changed " + tab);
                return;
            }
        });

        if (!changed) {
            tabs.push([tabId, vol]);
            localStorage.setItem("tabsVolList", JSON.stringify(tabs));
            console.log("added tab " + localStorage.getItem("tabsVolList"));
        }
        return;
    }

    localStorage.setItem("tabsVolList", JSON.stringify([[tabId, vol]]));
    console.log("created tabs " + localStorage.getItem("tabsVolList"));
}

vol_range.addEventListener("change", () => {
    vol_label.innerHTML = "Volume / " + (Number(vol_range.value) * 100).toFixed() + "%";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { id: 1, message: vol_range.value }, (response) => {
            if (response == "ok") {
                console.log(response);
                set_tabs_volumes(tabs[0].id, vol_range.value);
            }
        });
    });
}, false);
