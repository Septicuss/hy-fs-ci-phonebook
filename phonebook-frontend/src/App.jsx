import {useEffect, useState} from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";
import personService from './person-service.jsx';

const App = () => {
    const [filter, setFilter] = useState('')
    const [persons, setPersons] = useState([])
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        personService.getAll().then((response) => {
            setPersons(response)
        })
    }, []);

    useEffect(() => {
        if (!notification) return

        const id = setTimeout(() => {
            setNotification(null)
        }, 3000)

        return () => clearTimeout(id)
    }, [notification]);

    const sendNotification = (message, error) => {
        setNotification({
            message: message,
            error: error
        })
    }

    return (
        <div>
            <h2>Phonebook</h2>

            <Notification notification={notification} />

            <Filter
                filter={filter}
                setFilter={setFilter}
            />

            <h2>New person</h2>

            <PersonForm
                persons={persons}
                setPersons={setPersons}
                sendNotification={sendNotification}
            />

            <h2>Numbers</h2>

            <Persons
                filter={filter}
                persons={persons}
                setPersons={setPersons}
            />

        </div>
    )
}

export default App