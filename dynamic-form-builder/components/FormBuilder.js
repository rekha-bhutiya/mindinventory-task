import React, {useState} from "react";
import { useForm, joiResolver } from "@mantine/form"
import { TextField, Button, Checkbox, Container} from '@mui/material';

import Joi from "joi"

const FormBuilder = () => {

    const [formElements, setformElements] = useState([]);

    const form = useForm({
        initialValues: {},
        validate: joiResolver(
            Joi.object(formElements.reduce((schema, element) => {
                if(element.type === "text"){
                    schema[element.name] = Joi.string().pattern(/^[a-zA-Z+$]/).required().messages({
                        "string.pattern.base": "Only characters are allowed",
                        "any.required": "This field is required",
                    })
                }else if(element.type === "checkbox"){
                    schema[element.name] = Joi.boolean().required().messages({
                        "any.required": "This field is required",
                    })
                }
                return schema;
            }, {}))
        ),
    });

    const addElement = (type) => {
        console.log("Hello",type);
        const name = `element_${formElements.length}`
        setformElements([
            ...formElements,
            {type, name}
        ]);
        form.setFieldValue(name, type === "checkbox" ? false : "");
    }

    const handleFormSubmit = (values) => {
        console.log("testing",JSON.stringify(values, null, 2))
    }
    return (
        <Container size="sm" className="my-8">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Dynamic Form Builder</h1>
                <div className="mb-4x">
                    <label className="block mb-2">Add Form Element</label>
                    <select className="border p-2 rounded" onChange={(e) => addElement(e.target.value)}>
                        <option value="">Select an element</option>
                        <option value="text">Text Input</option>
                        <option value="checkbox">Checkbox</option>
                        {/* <option value="radio">Radio Button</option>
                        <option value="select">Select</option> */}
                    </select>
                </div>

                {formElements.map((element, index) => (
                    <div key={index} className="mb-4">
                        {element.type === "text" && (
                            <TextField 
                                label={`Text Input ${index + 1}`}
                                placeholder="Enter text"
                                {...form.getInputProps(element.name)}
                        />
                        )}
                        {element.type === "checkbox" && (
                            <Checkbox 
                                label={`Checkbox ${index + 1}`}
                                placeholder="Enter text"
                                {...form.getInputProps(element.name, {type: "checkbox"})}
                        />
                        )}
                        {form.errors[element.name] && (
                            <div className="text-red-500">
                                {form.errors[element.name]}
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