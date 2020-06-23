let tasks = [];
let importitems = 0;

function renderEditor() {
    let inputEl = document.querySelector("#default-todo-panel .todo-editor > input");
    //  添加操作
    let addTask = () => {
        if (inputEl.value.length === 0) {
            return;
        }
        let newTask = {
            title: inputEl.value,
            done: false,
        };

        inputEl.value = "";
        tasks.push(newTask);
        //   console.log("tasks: ", tasks);
        renderTaskItems();
    };

    inputEl.onkeypress = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    };

    let addEl = document.querySelector("#default-todo-panel .todo-editor > button");
    addEl.onclick = (e) => {
        //   console.log("add click");
        addTask();
    };
}

function renderTaskItems() {
    //   console.log("render items");
    let itemsEl = document.querySelector("#default-todo-panel .todo-items");

    itemsEl.querySelectorAll("div").forEach((node) => node.remove());

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        let itemEl = document.createElement("div");
        itemEl.className = "task";

        //  状态保存
        let doneEl = document.createElement("input");
        doneEl.type = "checkbox";

        //  完成操作
        doneEl.checked = task.done;

        if (task.done) {
            itemEl.classList.add("done");
        } else {
            itemEl.classList.remove("done");
        }

        doneEl.onchange = (e) => {
            task.done = e.target.checked;
            // console.log("checkbox: ", e);
            if (task.done) {
                itemEl.classList.add("done");
            } else {
                itemEl.classList.remove("done");
            }
        }
        itemEl.append(doneEl);

        let titleEl = document.createElement("label");
        titleEl.innerText = task.title;
        itemEl.append(titleEl);

        let ctrlbarEl = renderTaskCtrlBar(task, itemEl, i);

        itemEl.append(ctrlbarEl);
        itemsEl.append(itemEl);
    }
}

//  按钮控制函数
function renderTaskCtrlBar(task, itemEl, taskIdx) {
    let ctrlbarEl = document.createElement("div");
    ctrlbarEl.className = "ctrlbar";

    let impEl = document.createElement('input');
    impEl.type = 'checkbox'
    impEl.checked = task.import;
    if (task.import) {
        itemEl.classList.add('import')
    } else {
        itemEl.classList.remove('import')
    }
    impEl.onchange = (e) => {
        task.import = e.target.checked;
        if (task.import) {
            itemEl.classList.add("import");
            let t = task;
            for (let j = taskIdx; j > 0; j--) {
                tasks[j] = tasks[j - 1];
            }
            tasks[0] = t;
            importitems++;
        } else {
            itemEl.classList.remove("import");
            let t = task;
            for (let j = taskIdx; j < tasks.length - 1; j++) {
                tasks[j] = tasks[j + 1];
            }
            tasks[tasks.length - 1] = t;
            importitems--;
        }
        renderTaskItems();

    }
    ctrlbarEl.append(impEl);

    //  向上按钮
    let upEl = document.createElement("button");
    if (taskIdx === 0 || taskIdx === importitems) {
        upEl.disabled = true;
    }
    upEl.innerText = "↿";
    //  执行向上移动
    upEl.onclick = () => {
        let t = tasks[taskIdx];
        tasks[taskIdx] = tasks[taskIdx - 1];
        tasks[taskIdx - 1] = t;
        renderTaskItems();
    };
    ctrlbarEl.append(upEl);
    
    //  向下按钮
    let downEl = document.createElement("button");
    if (taskIdx === tasks.length - 1 || taskIdx === importitems - 1) {
        downEl.disabled = true;
    }
    downEl.innerText = "⇂";
    //  执行向下移动
    downEl.onclick = () => {
        let t = tasks[taskIdx];
        tasks[taskIdx] = tasks[taskIdx + 1];
        tasks[taskIdx + 1] = t;
        renderTaskItems();
    };
    ctrlbarEl.append(downEl);
    
    //  删除按钮
    let cancelEl = document.createElement("button");
    cancelEl.innerText = "X";
    //  进行删除操作
    cancelEl.onclick = () => {
        let flag = confirm(`您确定删除'${task.title}'这个待办项吗`);
        if(flag){
            tasks.splice(taskIdx, 1);
            renderTaskItems();  
        }
    };

    ctrlbarEl.append(cancelEl);
    return ctrlbarEl;
}
renderEditor();