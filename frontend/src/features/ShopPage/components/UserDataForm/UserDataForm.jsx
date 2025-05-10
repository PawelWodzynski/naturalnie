import React, { useState, useEffect } from 'react';
import styles from './UserDataForm.module.css';

const UserDataForm = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        primary_street: '',
        primary_buildingNumber: '',
        primary_apartmentNumber: '',
        primary_postalCode: '',
        primary_city: '',
        primary_voivodeship: '',
        primary_district: '',
        primary_commune: '',
        primary_phoneNumber: '',
        primary_nip: '',
        primary_companyName: '',
        alternative_street: '',
        alternative_buildingNumber: '',
        alternative_apartmentNumber: '',
        alternative_postalCode: '',
        alternative_city: '',
        alternative_voivodeship: '',
        alternative_district: '',
        alternative_commune: '',
        alternative_phoneNumber: '',
        alternative_nip: '',
        alternative_companyName: '',
    });
    const [useAlternativeAddress, setUseAlternativeAddress] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Brak tokenu uwierzytelniającego. Zaloguj się.");
                return;
            }

            try {
                const encodedToken = encodeURIComponent(token);
                const response = await fetch(`http://localhost:8080/get-user?token=${encodedToken}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `Błąd serwera: ${response.status}` }));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success && result.data) {
                    setUserData(result.data);
                    // Initial population of formData will be handled in another useEffect
                    // that depends on userData and useAlternativeAddress
                } else {
                    throw new Error(result.message || "Nie udało się pobrać danych użytkownika.");
                }
            } catch (err) {
                console.error("Błąd podczas pobierania danych użytkownika:", err);
                setError(err.message || "Wystąpił błąd podczas pobierania danych.");
            }
        };

        fetchUserData();
    }, []);

    // useEffect to update formData when userData or useAlternativeAddress changes (Step 004)
    useEffect(() => {
        if (userData) {
            const addressSource = useAlternativeAddress && userData.alternativeAddress ? userData.alternativeAddress : userData.primaryAddress;
            const altAddressSource = userData.alternativeAddress || {}; // Fallback for alternative if not present
            const primAddressSource = userData.primaryAddress || {}; // Fallback for primary if not present

            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                
                primary_street: primAddressSource.street || '',
                primary_buildingNumber: primAddressSource.buildingNumber || '',
                primary_apartmentNumber: primAddressSource.apartmentNumber || '',
                primary_postalCode: primAddressSource.postalCode || '',
                primary_city: primAddressSource.city || '',
                primary_voivodeship: primAddressSource.voivodeship || '',
                primary_district: primAddressSource.district || '',
                primary_commune: primAddressSource.commune || '',
                primary_phoneNumber: primAddressSource.phoneNumber || '',
                primary_nip: primAddressSource.nip || '',
                primary_companyName: primAddressSource.companyName || '',

                alternative_street: altAddressSource.street || '',
                alternative_buildingNumber: altAddressSource.buildingNumber || '',
                alternative_apartmentNumber: altAddressSource.apartmentNumber || '',
                alternative_postalCode: altAddressSource.postalCode || '',
                alternative_city: altAddressSource.city || '',
                alternative_voivodeship: altAddressSource.voivodeship || '',
                alternative_district: altAddressSource.district || '',
                alternative_commune: altAddressSource.commune || '',
                alternative_phoneNumber: altAddressSource.phoneNumber || '',
                alternative_nip: altAddressSource.nip || '',
                alternative_companyName: altAddressSource.companyName || '',
            });
        }
    }, [userData]); // Removed useAlternativeAddress from dependency array for now, will be handled in next step

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        setUseAlternativeAddress(e.target.checked);
        // Logic to switch displayed address fields will be in the rendering part
        // or a dedicated useEffect if complex state updates are needed beyond just display
    };

    const currentAddressPrefix = useAlternativeAddress ? 'alternative_' : 'primary_';

    return (
        <div className={styles.userDataFormContainer}>
            <h2>Dane Użytkownika</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">Imię:</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="lastName">Nazwisko:</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} />
                </div>

                <h3>Adres {useAlternativeAddress ? 'Alternatywny' : 'Główny'}</h3>
                
                <div className={styles.formGroup}>
                    <label htmlFor="street">Ulica:</label>
                    <input type="text" id="street" name={`${currentAddressPrefix}street`} value={formData[`${currentAddressPrefix}street`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="buildingNumber">Numer budynku:</label>
                    <input type="text" id="buildingNumber" name={`${currentAddressPrefix}buildingNumber`} value={formData[`${currentAddressPrefix}buildingNumber`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="apartmentNumber">Numer mieszkania:</label>
                    <input type="text" id="apartmentNumber" name={`${currentAddressPrefix}apartmentNumber`} value={formData[`${currentAddressPrefix}apartmentNumber`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="postalCode">Kod pocztowy:</label>
                    <input type="text" id="postalCode" name={`${currentAddressPrefix}postalCode`} value={formData[`${currentAddressPrefix}postalCode`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="city">Miasto:</label>
                    <input type="text" id="city" name={`${currentAddressPrefix}city`} value={formData[`${currentAddressPrefix}city`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="voivodeship">Województwo:</label>
                    <input type="text" id="voivodeship" name={`${currentAddressPrefix}voivodeship`} value={formData[`${currentAddressPrefix}voivodeship`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="district">Powiat:</label>
                    <input type="text" id="district" name={`${currentAddressPrefix}district`} value={formData[`${currentAddressPrefix}district`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="commune">Gmina:</label>
                    <input type="text" id="commune" name={`${currentAddressPrefix}commune`} value={formData[`${currentAddressPrefix}commune`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Numer telefonu:</label>
                    <input type="tel" id="phoneNumber" name={`${currentAddressPrefix}phoneNumber`} value={formData[`${currentAddressPrefix}phoneNumber`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="nip">NIP:</label>
                    <input type="text" id="nip" name={`${currentAddressPrefix}nip`} value={formData[`${currentAddressPrefix}nip`]} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="companyName">Nazwa firmy:</label>
                    <input type="text" id="companyName" name={`${currentAddressPrefix}companyName`} value={formData[`${currentAddressPrefix}companyName`]} onChange={handleChange} className={styles.inputField} />
                </div>

                {userData && userData.alternativeAddress && (
                    <div className={styles.formGroupCheckbox}>
                        <input 
                            type="checkbox" 
                            id="useAlternativeAddress" 
                            name="useAlternativeAddress" 
                            checked={useAlternativeAddress} 
                            onChange={handleCheckboxChange} 
                        />
                        <label htmlFor="useAlternativeAddress">Użyj Adres Alternatywny</label>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserDataForm;

