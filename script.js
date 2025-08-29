let name = document.getElementById('name');
let desigination = document.getElementById('desigination');
let salary = document.getElementById('salary');
let btn = document.getElementById('btn');
let cancelBtn = document.getElementById('cancelBtn');
let tableBody = document.querySelector("#employeeTable tbody");
let searchBox = document.getElementById('searchBox');
let filterBox = document.getElementById('filtered');   

let editId = null;

let employees = JSON.parse(localStorage.getItem('employees')) || [];
btn.addEventListener('click', add);
cancelBtn.addEventListener('click', cancelEdit);  // ✅ Cancel button wired here
renderTable();
Dropdown();

function add(event) {
    event.preventDefault();

    if (!name.value || !desigination.value || !salary.value) {
        alert("Please fill all fields");
        return;
    }

    if (editId) {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === editId) {
                employees[i].name = name.value;
                employees[i].desigination = desigination.value;
                employees[i].salary = salary.value;
                break; 
            }
        }
        editId = null; 
        btn.textContent = "Add Employee"; 
        cancelBtn.style.display = "none"; 
    } else {
        let obj = {
            id: Date.now(),
            name: name.value,
            desigination: desigination.value,
            salary: salary.value
        };
        employees.push(obj);
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    renderTable();
    Dropdown();
    clearInputs();
}

function renderTable(list = employees) {
    tableBody.innerHTML = "";
    list.forEach(element => {
        tableBody.innerHTML += `
        <tr>
            <td>${element.name}</td>
            <td>${element.desigination}</td>
            <td>${element.salary}</td>
            <td>
                <button onclick="editEmp(${element.id})">Edit</button>
                <button onclick="deleteEmp(${element.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function editEmp(id) {
    let emp = employees.find(emp => emp.id === id);
    name.value = emp.name;
    desigination.value = emp.desigination;
    salary.value = emp.salary;
    editId = id;
    btn.textContent = "Update Employee";
    cancelBtn.style.display = "inline-block";
}

function cancelEdit() {
    editId = null;
    clearInputs();
    btn.textContent = "Add Employee";
    cancelBtn.style.display = "none"; 
}

function deleteEmp(id) {
    let okaytodelete = confirm('Do you want to delete this employee');
    if (!okaytodelete) return;

    employees = employees.filter(emp => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderTable();
    Dropdown();
}

function clearInputs() {
    name.value = "";
    desigination.value = "";
    salary.value = "";
}

function Dropdown() {
    let jobs = [...new Set(employees.map(emp => emp.desigination))];
    filterBox.innerHTML = '<option value="">Designation</option>';

    jobs.forEach(job => {
        let option = document.createElement('option');
        option.value = job.toLowerCase();
        option.textContent = job;
        filterBox.appendChild(option);
    });
}

searchBox.addEventListener('input', function() {
    let query = searchBox.value.toLowerCase().trim();

    if (query === "") {
        renderTable();
        return;
    }

    let filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.desigination.toLowerCase().includes(query) ||
        emp.salary.toString().includes(query)
    );

    renderTable(filtered);
});

filterBox.addEventListener('change', () => {
    let selected = filterBox.value;

    if (selected === "") {
        renderTable(employees);
    } else {
        let filtered = employees.filter(emp => 
            emp.desigination.toLowerCase() === selected
        );
        renderTable(filtered);
    }
});
