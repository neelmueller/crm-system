function showBox(boxId) {
    document.querySelectorAll('.login, .register, .forgotPassword, .ResetPassword').forEach(box => box.style.display = 'none');
    document.getElementById(boxId).style.display = 'block';
}

document.getElementById('to_forgot').addEventListener('click', () => showBox('box_forgot'));
document.getElementById('to_register').addEventListener('click', () => showBox('box_register'));
document.getElementById('reg_to_login').addEventListener('click', () => showBox('box_login'));
document.getElementById('forgot_to_login').addEventListener('click', () => showBox('box_login'));

Login = document.getElementById('login_submit');
Login.addEventListener("submit", function(event) {
    event.preventDefault();
    const login_input = {
        email: document.getElementById('login_email').value, 
        password: document.getElementById('login_password').value
    }
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login_input)
    })
    .then((response) => response.json())
    .then((data) => console.log(data, document.getElementById('log_output').textContent = JSON.stringify(data)))
    .catch((error) => console.error(error))
})

Register = document.getElementById('register_submit');
Register.addEventListener("submit", function(event) {
    event.preventDefault();
    const register_input = {
        email: document.getElementById('register_email').value, 
        password: document.getElementById('register_password').value, 
        name: document.getElementById('register_name').value
    }
    fetch('http://localhost:3000/auth/register',{
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(register_input)
    })
    .then((response) => response.json())
    .then((data) => console.log(data, document.getElementById('reg_output').textContent = JSON.stringify(data)))
    .catch((error) => console.error(error))
})

ForgotPassword = document.getElementById('forgotPassword_submit');
ForgotPassword.addEventListener("submit", function(event) {
    event.preventDefault();
    const forgotPassword_input = {
        email: document.getElementById('forgot_email').value
    }
    fetch('http://localhost:3000/auth/forgotPassword', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotPassword_input)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data, document.getElementById('for_output').textContent = JSON.stringify(data));
        showBox('box_reset');
    })
    .catch((error) => console.error(error))
})

ResetPassword = document.getElementById('resetPassword_submit');
ResetPassword.addEventListener("submit", function(event) {
    event.preventDefault();
    const resetPassword_input = {
        newPassword: document.getElementById('reset_password').value, 
        token: document.getElementById('reset_token').value
    }
    fetch('http://localhost:3000/auth/resetPassword', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetPassword_input)
    })
    .then((response) => response.json())
    .then((data) => console.log(data, document.getElementById('res_output').textContent = JSON.stringify(data)))
    .catch((error) => console.error(error))
})

const createAppointmentForm = document.getElementById('create_appointment_form');
if (createAppointmentForm) {
    createAppointmentForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const payload = {
            title: document.getElementById('appointment_title').value,
            description: document.getElementById('appointment_description').value,
            scheduled_at: document.getElementById('appointment_scheduled_at').value,
            duration_minutes: Number(document.getElementById('appointment_duration').value)
        };

        const output = document.getElementById('create_appointment_output');

        try {
            const response = await fetch('http://localhost:3000/appointments/createAppointment', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            console.log(data);
        } catch (error) {
            console.error(error);
            output.textContent = 'Failed to create appointment';
        }
    });
}

const fetchAppointmentsButton = document.getElementById('fetch_appointments');
if (fetchAppointmentsButton) {
    fetchAppointmentsButton.addEventListener('click', async function() {
        try {
            const response = await fetch('http://localhost:3000/appointments/getCostumerAppointments', {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            document.getElementById('appointments_output').textContent = JSON.stringify(data, null, 2);
            console.log(data);
        } catch (error) {
            console.error(error);
            document.getElementById('appointments_output').textContent = 'Failed to load appointments';
        }
    });
}