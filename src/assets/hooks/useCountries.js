import { useState, useEffect } from "react";
import { getCountries } from "../../api/apiService";

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const countriesData = await getCountries();
        console.log("countriesData", countriesData);
        setCountries(countriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries. Please try again later.");
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const fetchCities = (countryId) => {
    const selectedCountry = countries.find(
      (country) => country.id === parseInt(countryId)
    );
    setCities(selectedCountry ? selectedCountry.cities : []);
  };

  return { countries, cities, loading, error, fetchCities };
};
