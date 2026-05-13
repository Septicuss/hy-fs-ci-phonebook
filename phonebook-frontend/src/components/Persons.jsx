import personService from "../person-service.jsx";

const Persons = ({filter, persons, setPersons}) => {

    const handleFilter = (person) => {
        if (filter === '') return true
        return person.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
    }

    const handleDelete = (id) => {
        const person = persons.find((person) => person.id === id)
        if (person == undefined) {
            alert("Person not found")
            return
        }

        if (!window.confirm(`Delete ${person.name}?`)) {
            return
        }

        personService.remove(person.id)
            .then(() => {
                setPersons(persons.filter(p => p.id !== id))
            })
    }

    return (
        <>
            {persons.filter(handleFilter).map((person) => (
                    <p key={person.name}>{person.name} {person.number}
                        <button onClick={() => handleDelete(person.id)}>delete</button>
                    </p>
            ))}
        </>
    )
}

export default Persons