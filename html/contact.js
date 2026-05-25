import { append } from './terminal.js';

let formState = null;

function startContactForm() {
    append(`      
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝ 

 Control + C to exit out of form
 Control + Z to go back to previous step
 \n\n`)
    formState = { step: 'name', name: '', email: '', message: '' };
    append('what\'s your name?\n');
}

function handleFormInput(input) {
    if (formState.step === 'name') {
        formState.name = input;
        formState.step = 'email';
        append(`What's your email?\n`);

    } else if (formState.step === 'email') {
        formState.email = input;
        formState.step = 'message';
        append(`what's your message?\n`);

    } else if (formState.step === 'message') {
        formState.message = input;
        formState.step = null;
        append('sending...\n');

        fetch('http://localhost:8080/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState)
        })
        .then(() => {
            append('Message sent\n');
            formState = null; 
        })
        .catch(() => {
            append('Something went wrong\n');
            formState = null;
        });
    }
}