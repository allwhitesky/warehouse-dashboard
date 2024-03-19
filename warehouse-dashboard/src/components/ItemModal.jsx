import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';

import { useEffect } from 'react';
import { supabase } from "../lib/helper/supabaseClient";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 1,
};


const InputField = styled.div`
    margin: 5px;
`

const InputHolder = styled.div` 
    display: flex; 
    flex-wrap: wrap;
`

const ModalButton = styled.button`
    margin: 5px;
    background-color: ${props => { return props.secondary ? '#96d4a0' : '#e43939' }};
`
async function getProjects() {
    let { data: projects, error } = await supabase
        .from('projects')
        .select('*')
    return projects
}
async function deleteItem(itemId) {
    const { error } = await supabase
        .from('items')
        .delete()
        .eq('item_id', itemId)
    return error
}

async function getData() {
    let { data: items, error } = await supabase
        .from('items')
        .select('*')
    return items

}
async function updateData(props) {
    console.log("UPDATE DATA", props)
    console.log("UPDATE DATA", props.images)
    const { data, error } = await supabase
        .from('items')
        .update({
            item_name: `${props.itemName}`,
            manufacturer: `${props.manufacturer}`,
            arrival_date_actual: props.recievedDate ? props.recievedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : null,
            inspection_date: props.inspectedDate ? props.inspectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : null,
            project_id: `${props.project}`,
            condition: `${props.condition}`,
            location: `${props.location}`,
            photos: props.images,
            carrier: `${props.freight}`,
        })
        .eq('item_id', props.itemId)
        .select();
    return data, error

}

function ChildModal() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button onClick={handleOpen}>Open Child Modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title">Text in a child modal</h2>
                    <p id="child-modal-description">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </p>
                    <Button onClick={handleClose}>Close Child Modal</Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default function NestedModal({ data }) {

    console.log("BINK BONK DATA", data.item_id)
    const [projects, setProjects] = React.useState([{}])

    const itemNo = data.item_number
    const itemId = data.item_id

    const [itemName, setItemName] = React.useState(data.item_name)

    const [recievedDate, setRecievedDate] = React.useState(new Date(data.arrival_date_actual))
    const [inspectedDate, setInspectedDate] = React.useState(data.inspection_date ? new Date(data.inspection_date) : null)
    const [project, setProject] = React.useState(data.project_id)
    const [manufacturer, setManufacturer] = React.useState(data.manufacturer)
    const [freight, setFreight] = React.useState(data.carrier)
    const [condition, setCondition] = React.useState(data.condition)
    const [location, setLocation] = React.useState(data.location)
    const [notes, setNotes] = React.useState("")
    const [damageNotes, setDamageNotes] = React.useState("")


    useEffect(() => {
        getProjects().then(data => {
            setProjects(data);
        });
    }, []);

    console.log("PROJECTS", projects)



    const [images, setImages] = React.useState(data.photos || []);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const nextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const prevImage = () => {
        setCurrentImageIndex((currentImageIndex - 3 + images.length) % images.length);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        deleteItem(itemId).then(data => console.log(data))
        setOpen(false)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        updateData({ itemId, condition, itemName, recievedDate, manufacturer, inspectedDate, project, location, images, freight }).then(data => console.log(data))
        handleClose()
    }

    function handleDeletePhoto(index) {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const readImages = selectedFiles.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        dataUrl: reader.result
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readImages).then((imageObjects) => {
            setImages([...images, ...imageObjects]);
        });
    };
    console.log(images)


    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: '80%' }}>
                    <h2 style={{ 'margin': '5px' }} id="parent-modal-title">Item Detail Edit</h2>
                    <hr style={{ margin: 0, padding: 0, width: '100%' }} />

                    <form style={{ height: '100%', overflow: 'auto' }} onSubmit={handleSubmit}>
                        <InputHolder>
                            <InputField>
                                <div>Item No.</div>
                                <input
                                    type="text"
                                    id="itemNo"
                                    name="itemNo"
                                    value={itemNo}
                                    disabled
                                />
                            </InputField>
                            <InputField>
                                <div>Item Name</div>
                                <input
                                    type="text"
                                    id="itemName"
                                    name="itemName"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />
                            </InputField>
                            <InputField >
                                <div>Received Date</div>
                                <input
                                    type="date"
                                    id="recievedDate"
                                    name="recievedDate"
                                    value={recievedDate?.toISOString().substring(0, 10)}
                                    onChange={(e) => setRecievedDate(new Date(e.target.value))}
                                />
                            </InputField>
                            <InputField>
                                <div>Inspected Date</div>
                                <input
                                    type="date"
                                    id="inspectedDate"
                                    name="inspectedDate"
                                    value={inspectedDate?.toISOString().substring(0, 10)}
                                    onChange={(e) => setInspectedDate(new Date(e.target.value))}

                                />
                            </InputField>
                            <InputField >
                                <div>manufacturer</div>
                                <input
                                    type="text"
                                    id="manufacturer"
                                    name="manufacturer"
                                    value={manufacturer}
                                    onChange={(e) => setManufacturer(e.target.value)}
                                />
                            </InputField>
                            <InputField>
                                <div>freight Co</div>
                                <input
                                    type="text"
                                    id="freight"
                                    name="freight"
                                    value={freight}
                                    onChange={(e) => setFreight(e.target.value)}
                                />
                            </InputField>
                            <InputField>
                                <div>Condition</div>
                                <input
                                    type="text"
                                    id="condition"
                                    name="condition"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                />
                            </InputField>
                            <InputField>
                                <div>Location</div>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </InputField>
                            <InputField>
                                <div>project</div>
                                <select
                                    id="project"
                                    name="project"
                                    value={project}
                                    onChange={(e) => { console.log(e.target.value); setProject(e.target.value) }}
                                >
                                    {projects.map((project, index) => (
                                        <option key={index} value={project.project_id}>
                                            {project.project_name}
                                        </option>
                                    ))}
                                </select>
                            </InputField>

                        </InputHolder>
                        <InputHolder style={{ width: '100%' }}>
                            <InputField style={{ width: '100%' }}>
                                <div>item notes</div>
                                <input
                                    style={{ width: '100%' }}
                                    type="text"
                                    id="notes"
                                    name="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </InputField>
                        </InputHolder>
                        <InputHolder style={{ width: '100%' }}>
                            <InputField style={{ width: '100%' }}>
                                <div>Damage notes</div>
                                <input
                                    style={{ width: '100%' }}
                                    type="text"
                                    id="damageNotes"
                                    name="damageNotes"
                                    value={damageNotes}
                                    onChange={(e) => setDamageNotes(e.target.value)}
                                />
                            </InputField>
                        </InputHolder>


                        <div>Image Gallery</div>
                        <div style={{ overflow: 'auto', height: '30%' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', overflow: 'auto' }}>
                                {images.map((image, index) => (
                                    <div key={index} style={{ margin: '5px', position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={image.dataUrl}
                                            style={{ width: '100px', height: '100px' }}
                                            alt={image.name}
                                        />
                                        <button
                                            type='button'
                                            style={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                backgroundColor: 'red',
                                                color: 'white',
                                                width: '20px',
                                                height: '20px',
                                                padding: '0px',


                                            }}
                                            onClick={() => handleDeletePhoto(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <input type="file" multiple onChange={handleFileChange} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
                            <ModalButton onClick={handleDelete} type='button'>Delete Item</ModalButton>
                            <ModalButton secondary >Update Item</ModalButton>
                        </div>
                    </form>



                </Box>
            </Modal>
        </div>
    );
}
