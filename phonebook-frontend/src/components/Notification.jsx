const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    const error = notification.error ?? false
    const message = notification.message

    return (
        <div className={`notification ${error ? 'error' : ''}`}>
            {message}
        </div>
    )
}

export default Notification