import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Auth from '../utils/auth';
import { getCardioById, getResistanceById, deleteCardio, deleteResistance, updateCardio, updateResistance } from '../utils/API';
import { formatDate } from '../utils/dateFormat';
import Header from "./Header";
import cardioIcon from "../assets/images/cardio-w.png"
import resistanceIcon from "../assets/images/resistance-w.png"

export default function SingleExercise() {
    const { id, type } = useParams();
    const [cardioData, setCardioData] = useState({});
    const [resistanceData, setResistanceData] = useState({});
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);  // For toggling the edit form

    const loggedIn = Auth.loggedIn();
    const navigate = useNavigate();

    useEffect(() => {
        const displayExercise = async (exerciseId) => {
            // Get token
            const token = loggedIn ? Auth.getToken() : null;
            if (!token) return false;

            // Fetch cardio data by id
            if (type === "cardio") {
                try {
                    const response = await getCardioById(exerciseId, token);
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                    }

                    const cardio = await response.json();
                    cardio.date = formatDate(cardio.date);
                    setCardioData(cardio);
                    setFormData(cardio);  // Pre-fill the form with data
                } catch (err) {
                    console.error(err);
                }
            }

            // Fetch resistance data by id
            else if (type === "resistance") {
                try {
                    const response = await getResistanceById(exerciseId, token);
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                    }

                    const resistance = await response.json();
                    resistance.date = formatDate(resistance.date);
                    setResistanceData(resistance);
                    setFormData(resistance);  // Pre-fill the form with data
                } catch (err) {
                    console.error(err);
                }
            }
        };

        displayExercise(id);
    }, [id, type, loggedIn]);

    // Redirect to login if user is not logged in
    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    const handleDeleteExercise = async (exerciseId) => {
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        confirmAlert({
            title: "Delete Exercise",
            message: "Are you sure you want to delete this exercise?",
            buttons: [
                {
                    label: "Cancel",
                },
                {
                    label: "Delete",
                    onClick: async () => {
                        // Delete cardio data
                        if (type === "cardio") {
                            try {
                                const response = await deleteCardio(exerciseId, token);
                                if (!response.ok) {
                                    throw new Error('Something went wrong!');
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        }

                        // Delete resistance data
                        else if (type === "resistance") {
                            try {
                                const response = await deleteResistance(exerciseId, token);
                                if (!response.ok) {
                                    throw new Error('Something went wrong!');
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        }

                        // Go back to history
                        navigate("/history");
                    }
                }
            ]
        });
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle update exercise
    const handleUpdateExercise = async () => {
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        // Make sure to handle form data according to type
        if (type === "cardio") {
            try {
                const response = await updateCardio(id, formData, token);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                navigate("/history");
            } catch (err) {
                console.error(err);
            }
        } else if (type === "resistance") {
            try {
                const response = await updateResistance(id, formData, token);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                navigate("/history");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
            <Header />
            <h2 className='title text-center'>History</h2>
            <div className="single-exercise d-flex flex-column align-items-center text-center">
                {isEditing ? (
                    // Update form
                    <>
                        {type === "cardio" && (
                            <div className='cardio-div'>
                                <div className='d-flex justify-content-center'>
                                    <img alt="cardio" src={cardioIcon} className="exercise-form-icon" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleInputChange}
                                    placeholder="Exercise Name"
                                />
                                <input
                                    type="number"
                                    name="distance"
                                    value={formData.distance || ""}
                                    onChange={handleInputChange}
                                    placeholder="Distance"
                                />
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration || ""}
                                    onChange={handleInputChange}
                                    placeholder="Duration (minutes)"
                                />
                                <button className='update-btn' onClick={handleUpdateExercise}>Update Exercise</button>
                                <button className='cancel-btn' onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        )}
                        {type === "resistance" && (
                            <div className='resistance-div'>
                                <div className='d-flex justify-content-center'>
                                    <img alt="resistance" src={resistanceIcon} className="exercise-form-icon" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleInputChange}
                                    placeholder="Exercise Name"
                                />
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight || ""}
                                    onChange={handleInputChange}
                                    placeholder="Weight (lbs)"
                                />
                                <input
                                    type="number"
                                    name="sets"
                                    value={formData.sets || ""}
                                    onChange={handleInputChange}
                                    placeholder="Sets"
                                />
                                <input
                                    type="number"
                                    name="reps"
                                    value={formData.reps || ""}
                                    onChange={handleInputChange}
                                    placeholder="Reps"
                                />
                                <button className='update-btn' onClick={handleUpdateExercise}>Update Exercise</button>
                                <button className='cancel-btn' onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        )}
                    </>
                ) : (
                    // View details
                    <>
                        {type === "cardio" && (
                            <div className='cardio-div'>
                                <div className='d-flex justify-content-center'>
                                    <img alt="cardio" src={cardioIcon} className="exercise-form-icon" />
                                </div>
                                <p><span>Date: </span> {cardioData.date}</p>
                                <p><span>Name: </span> {cardioData.name}</p>
                                <p><span>Distance: </span> {cardioData.distance} miles</p>
                                <p><span>Duration: </span> {cardioData.duration} minutes</p>
                                <button className='delete-btn' onClick={() => handleDeleteExercise(id)}>Delete Exercise</button>
                                <button className='edit-btn' onClick={() => setIsEditing(true)}>Edit Exercise</button>
                            </div>
                        )}
                        {type === "resistance" && (
                            <div className='resistance-div'>
                                <div className='d-flex justify-content-center'>
                                    <img alt="resistance" src={resistanceIcon} className="exercise-form-icon" />
                                </div>
                                <p><span>Date: </span> {resistanceData.date}</p>
                                <p><span>Name: </span> {resistanceData.name}</p>
                                <p><span>Weight: </span> {resistanceData.weight} lbs</p>
                                <p><span>Sets: </span> {resistanceData.sets}</p>
                                <p><span>Reps: </span> {resistanceData.reps}</p>
                                <button className='delete-btn' onClick={() => handleDeleteExercise(id)}>Delete Exercise</button>
                                <button className='edit-btn' onClick={() => setIsEditing(true)}>Edit Exercise</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
