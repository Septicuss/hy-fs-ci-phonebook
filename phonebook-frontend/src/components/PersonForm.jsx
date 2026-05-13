import {useState} from "react";
import personService from '../person-service.jsx'

const PersonForm = ({persons, setPersons, sendNotification}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const clearFields = () => {
        setNewNumber('')
        setNewName('')
    }

    const handleSubmitNewPerson = (event) => {
        event.preventDefault()

        // check if person already exists
        const existingPerson = persons.find((person) => person.name === newName)
        if (existingPerson) {

            // check if number changed
            if (newNumber === existingPerson.number) {
                alert(`${newName} is already added to phonebook and number did not change`)
                return
            }

            // exists but number changed, confirm update
            if (!window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number?`)) {
                return
            }

            const updatedPerson = {
                ...existingPerson,
                number: newNumber
            }

            personService.updateNumber(updatedPerson).then((resultPerson) => {
                setPersons(persons.map((person) => person.id == resultPerson.id ? updatedPerson : person))
                sendNotification(`Updated number of ${updatedPerson.name}`)
                clearFields()
            }).catch(error => {
                console.log(error)

                // naive error check
                if (error.name == 'AxiosError') {
                    sendNotification(`Person validation failed: ${error.response.data.error}`, true)
                } else {
                    sendNotification(`Information of ${existingPerson.name} has already been deleted`, true)
                    // visually remove likely invalid person
                    setPersons(persons.filter((person) => person.id !== existingPerson.id))
                }

            })

            return
        }

        const person = {
            name: newName,
            number: newNumber,
            id: String(persons.length + 1)
        }

        personService.create(person).then((response) => {
            setPersons(persons.concat(response))
            sendNotification(`Added ${person.name}`)
            clearFields()
        }).catch(error => {
            console.log(error)
            sendNotification(`Person validation failed: ${error.response.data.error}`, true)
        })
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <form onSubmit={handleSubmitNewPerson}>
            <div>name: <input value={newName} onChange={handleNameChange}/></div>
            <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm