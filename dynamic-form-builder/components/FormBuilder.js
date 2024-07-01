import React, {useEffect, useState} from "react";
import { useForm, joiResolver } from "@mantine/form"
import { TextField, Button, Checkbox, Container, FormControl, Select, MenuItem, RadioGroup, InputLabel, FormControlLabel, Radio} from '@mui/material';

import Joi from "joi"

const FormBuilder = () => {

    const [formElements, setformElements] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);

    const form = useForm({
        initialValues: {},
        validate: joiResolver(
            Joi.object(formElements.reduce((schema, element) => {
                if(element.type === "text"){
                    schema[element.name] = Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
                        "string.pattern.base": "Only characters are allowed",
                        "string.empty": "This field is required",
                        "any.required": "This field is required",
                    })
                }else if(element.type === "checkbox"){
                    schema[element.name] = Joi.boolean().required().messages({
                        "string.empty": "This field is required",
                        "any.required": "This field is required",
                    })
                }else if(element.type === "radio"){
                    schema[element.name] = Joi.string().required().messages({
                        "string.empty": "This field is required",
                        "any.required": "This field is required",
                    })
                }else if(element.type === "select"){
                    schema[element.name] = Joi.string().required().messages({
                        "string.empty": "This field is required",
                        "any.required": "This field is required",
                    });
                    schema[`${element.name}_state`] = Joi.string().required().messages({
                        "string.empty": "This field is required",
                        "any.required": "This field is required",
                    });
                }
                return schema;
            }, {}))
        ),
    });

    useEffect(() => {
        const Countries_list = [
            {name: "India", states: ["Gujarat", "Maharashtra", "Assam"]},
            {name: "Canada", states: ["Manitoba", "Ontario"]}
        ]
        setCountries(Countries_list);
    },[]);

    const addElement = (type) => {
        console.log("Hello",type);
        const name = `element_${formElements.length}`
        setformElements([
            ...formElements,
            {type, name}
        ]);
        form.setFieldValue(name, type === "checkbox" ? false : "");
        if(type === "select"){
            form.setFieldValue(`${name}_state`, "")
        }
    }

    const handleCountryChange = (event, name) => {
        const selectedCountry = countries.find(country => country.name === event.target.value)
        console.log("thhhh",selectedCountry)
        setStates(selectedCountry ? selectedCountry.states : []);
        form.setFieldValue(name, event.target.value);
        form.setFieldValue(`${name}_state`, "")
    }
    const handleFormSubmit = (values) => {
        console.log("testing",JSON.stringify(values, null, 2))
    }
    return (
        <Container maxWidth="sm" className="my-8 bg-blue-50 p-8 rounded-lg shadow-md">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Dynamic Form Builder</h1>
                <div className="mb-4">
                    <label className="block mb-2">Add Form Element</label>
                    <select className="border p-2 rounded w-full" onChange={(e) => addElement(e.target.value)}>
                        <option value="">Select an element</option>
                        <option value="text">Text Input</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio Button</option>
                        <option value="select">Select</option> 
                    </select>
                </div>

                {formElements.map((element, index) => (
                    <div key={index} className="mb-4">
                        {element.type === "text" && (
                            <TextField 
                                fullWidth
                                label={`Text Input ${index + 1}`}
                                placeholder="Enter text"
                                {...form.getInputProps(element.name)}
                        />
                        )}
                        {element.type === "checkbox" && (
                            <FormControl>
                                <FormControlLabel
                                control={
                                    <Checkbox 
                                        {...form.getInputProps(element.name, {type: "checkbox"})}
                                    />
                                }
                                label={`Checkbox ${index + 1}`}
                                />
                            </FormControl>
                        )}
                        {element.type === "radio" && (
                          <FormControl component="fieldset">
                            <RadioGroup {...form.getInputProps(element.name)}>
                                <FormControlLabel control={<Radio />} value="value1" label="Value 1"></FormControlLabel>
                                <FormControlLabel control={<Radio />} value="value2" label="Value 2"></FormControlLabel>
                            </RadioGroup>

                          </FormControl>
                        )}
                        {element.type === "select" && (
                          <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel >Country</InputLabel>
                                <Select
                                    value={form.values[element.name] || ""}
                                    onChange={(e) => handleCountryChange(e, element.name)}
                                >
                                    {countries.map((country) => (
                                        <MenuItem key={country.name} value={country.name}>
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                   <InputLabel>State</InputLabel> 
                                   <Select 
                                   value={form.values[`${element.name}_state`] || ""}
                                   onChange={(e) => form.setFieldValue(`${element.name}_state`,e.target.value)}
                                   >
                                    {states.map((state) => (
                                    <MenuItem key={state} value={state}>
                                        {state}
                                    </MenuItem>
                                    ))}
                                   </Select>
                            </FormControl>
                          </div>
                        )}
                        {form.errors[element.name] && (
                            <div className="text-red-500">
                                {form.errors[element.name]}
                            </div>
                        )}
                        {form.errors[`${element.name}_state`] && (
                            <div className="text-red-500">
                                {form.errors[`${element.name}_state`]}
                            </div>
                        )}
                    </div>
                ))}
                <Button variant="contained" onClick={form.onSubmit(handleFormSubmit)}>Submit</Button>
            </div>
        </Container>
    )
}

export default FormBuilder;