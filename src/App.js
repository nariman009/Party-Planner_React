import React, { useState, useEffect } from 'react';
import './styles.css'; 

const API_ENDPOINT = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-AM/events";

function App() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(API_ENDPOINT);
            const json = await response.json();
            setEvents(json.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const toggleDescription = (eventId) => {
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, showDescription: !event.showDescription } : event
        ));
    };

    const postParty = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        console.log(formData);
        const newParty = {
            name: formData.get('party-name'),
            date: formData.get('party-date'),
            description: formData.get('party-description'),
            location: formData.get('party-location'),
            cohortId: 2, 
        };
        console.log(newParty);
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newParty),
            });

            if (response.ok) {
                fetchEvents();
            } else {
                console.error('Failed to post new event');
            }
        } catch (error) {
            console.error('Error posting new event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/${eventId}`, { method: 'DELETE' });

            if (response.ok) {
                fetchEvents();
            } else {
                console.error('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <form id="party-form" onSubmit={postParty}>
                <h2>Add a New Party</h2>
                <input type="text" id="party-name" name="party-name" placeholder="Name" required /><br />
                <input type="text" id="party-date" name="party-date" placeholder="Date (YYYY-MM-DDTHH:MM:SS.000Z)" required /><br />
                <input type="text" id="party-location" name="party-location" placeholder="Location" required /><br />
                <textarea id="party-description" name="party-description" placeholder="Description" required></textarea><br />
                <button type="submit">Submit</button>
            </form>

            <h1>Upcoming Parties</h1>
            <div id="events-container">
                {events.map(event => (
                    <div className="event" key={event.id}>
                        <h2 className="event-name" onClick={() => toggleDescription(event.id)}>
                            {event.name}
                        </h2>
                        <p>Date: {event.date}</p>
                        <p>Location: {event.location}</p>
                        {event.showDescription && <p className="event-description">{event.description}</p>}
                        <button className="delete-btn" onClick={() => deleteEvent(event.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
