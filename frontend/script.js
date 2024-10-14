document.getElementById('sendBTN').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value; // Get the user input
    document.getElementById('messages').innerHTML += `<li class="chat-incoming chat"><p>User: ${userInput}</p></li>`;
    document.getElementById('user-input').value = ''; // Clear the input field

    // Normalize input to lower case for easier comparison
    const normalizedInput = userInput.toLowerCase();

    // Handle different user inputs
    if (normalizedInput.includes('get me list of clients')) {
        fetch('http://localhost:3000/api/getClients')
            .then(response => response.json())
            .then(data => {
                let gridHtml = '<table><tr><th>ID</th><th>First Name</th><th>Last Name</th></tr>';
                data.forEach(client => {
                    // Add a click event to the row
                    gridHtml += `<tr onclick="getClientDetails('${client.PTY_ID}', '${client.PTY_FirstName}')">
                                    <td>${client.PTY_ID}</td>
                                    <td>${client.PTY_FirstName}</td>
                                    <td>${client.PTY_LastName}</td>
                                 </tr>`;
                });
                gridHtml += '</table>';
                document.getElementById('grid-container').innerHTML = gridHtml;
                document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Here is the list of clients.</p></li>';
            })
            .catch(error => console.error('Error fetching clients:', error));
    }
     else if (normalizedInput.includes('get me a client data')) {
        const nameMatch = normalizedInput.match(/named (.+)/); // Extract the client name
        if (nameMatch) {
            const clientName = nameMatch[1].trim(); // Trim whitespace
            fetch(`http://localhost:3000/api/getClientwithName?name=${encodeURIComponent(clientName)}`)
                .then(response => response.json())
                .then(data => {
                    const detailsDiv = document.getElementById('grid-container');
                    if (data.length > 0) {
                        const client = data[0]; // Get the first client data
                        detailsDiv.innerHTML = `
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone</th>
                                    <th>SSN</th>
                                </tr>
                                <tr>
                                    <td>${client.PTY_ID}</td>
                                    <td>${client.PTY_FirstName}</td>
                                    <td>${client.PTY_LastName}</td>
                                    <td>${client.PTY_Phone}</td>
                                    <td>${client.PTY_SSN}</td>
                                </tr>
                            </table>
                        `;
                        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Here are the details for the client.</p></li>';
                    } else {
                        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Client not found.</p></li>';
                    }
                })
                .catch(error => console.error('Error fetching client data:', error));
        } else {
            document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Please specify the client name.</p></li>';
        }

    } else if (normalizedInput.includes('get address for a client with name')) {
        // Extract the client name from the user input
        const nameMatch = normalizedInput.match(/name\s+(.+)/); // Capture everything after "name"
        if (nameMatch) {
            const clientName = nameMatch[1].trim(); // Trim whitespace
            fetch(`http://localhost:3000/api/getAddressforClient/name/${encodeURIComponent(clientName)}`)
                .then(response => response.json())
                .then(data => {
                    const addressDiv = document.getElementById('grid-container');
                    if (data.length > 0) {
                        const address = data[0]; // Get the first address (if there are multiple)
                        addressDiv.innerHTML = `
                            <table>
                                <tr><th>Field</th><th>Details</th></tr>
                                <tr><td>Line 1</td><td>${address.Add_Line1}</td></tr>
                                <tr><td>Line 2</td><td>${address.Add_Line2 || 'N/A'}</td></tr>
                                <tr><td>City</td><td>${address.Add_City}</td></tr>
                                <tr><td>State</td><td>${address.Stt_Name}</td></tr>
                                <tr><td>Zip Code</td><td>${address.Add_Zip}</td></tr>
                            </table>
                        `;
                        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Here is the address for the client.</p></li>';
                    } else {
                        addressDiv.innerHTML = '';
                        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Address not found.</p></li>';
                    }
                })
                .catch(error => console.error('Error fetching address:', error));
        } else {
            document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Please specify the client name.</p></li>';
        }

    } else if (normalizedInput.includes('get address for a client with id=')) {
        const idMatch = normalizedInput.match(/id=(\d+)/);
        if (idMatch) {
            const clientId = idMatch[1]; // Capture the ID
            fetch(`http://localhost:3000/api/getAddressforClient/${clientId}`)
                .then(response => response.json())
                .then(data => {
                    const addressDiv = document.getElementById('grid-container');
                    if (data.length > 0) {
                        const address = data[0];
                        const addressHtml = `
                            <table>
                                <tr><th>Field</th><th>Details</th></tr>
                                <tr><td>Line 1</td><td>${address.Add_Line1}</td></tr>
                                <tr><td>Line 2</td><td>${address.Add_Line2 || 'N/A'}</td></tr>
                                <tr><td>City</td><td>${address.Add_City}</td></tr>
                                <tr><td>State</td><td>${address.Stt_Name}</td></tr>
                                <tr><td>Zip Code</td><td>${address.Add_Zip}</td></tr>
                            </table>
                        `;
                        addressDiv.innerHTML = addressHtml;
                        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Here is the address for the client.</p></li>';
                    } else {
                        addressDiv.innerHTML = '';
                        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Address not found.</p></li>';
                    }
                })
                .catch(error => console.error('Error fetching address:', error));
        } else {
            document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Please specify the client ID.</p></li>';
        }

    } else {
        document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: I can help you with: 1. Get me list of clients 2. Get me a client data (named John) 3. Get address for a client with ID=? 4. Get address for a client with name.</p></li>';
    }
});
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const isVisible = sidebar.style.right === "0px";
    sidebar.style.right = isVisible ? "-250px" : "0px";
}
function closeChat() {
    alert('Closing Chat...');
}
function logout() {
    alert('Logging out...');
}
// Function to get client details by ID (and optionally name)
function getClientDetails(clientId, clientName) {
    // Fetch client details using the getClientwithName API
    fetch(`http://localhost:3000/api/getClientwithName?name=${encodeURIComponent(clientName)}`)
        .then(response => response.json())
        .then(clientData => {
            if (clientData.length > 0) {
                const client = clientData[0];
                // Display detailed client info
                const detailsDiv = document.getElementById('grid-container');
                detailsDiv.innerHTML = `
                    <h3>Client Details</h3>
                    <table>
                        <tr><th>ID</th><td>${client.PTY_ID}</td></tr>
                        <tr><th>First Name</th><td>${client.PTY_FirstName}</td></tr>
                        <tr><th>Last Name</th><td>${client.PTY_LastName}</td></tr>
                        <tr><th>Phone</th><td>${client.PTY_Phone}</td></tr>
                        <tr><th>SSN</th><td>${client.PTY_SSN}</td></tr>
                    </table>
                `;

                // Now fetch address using the getAddressforClient API
                fetch(`http://localhost:3000/api/getAddressforClient/${clientId}`)
                    .then(response => response.json())
                    .then(addressData => {
                        if (addressData.length > 0) {
                            const address = addressData[0];
                            detailsDiv.innerHTML += `
                                <h3>Address Details</h3>
                                <table>
                                    <tr><th>Line 1</th><td>${address.Add_Line1}</td></tr>
                                    <tr><th>Line 2</th><td>${address.Add_Line2 || 'N/A'}</td></tr>
                                    <tr><th>City</th><td>${address.Add_City}</td></tr>
                                    <tr><th>State</th><td>${address.Stt_Name}</td></tr>
                                    <tr><th>Zip Code</th><td>${address.Add_Zip}</td></tr>
                                </table>
                            `;
                        } else {
                            detailsDiv.innerHTML += `<p>No address found for this client.</p>`;
                        }
                    })
                    .catch(error => console.error('Error fetching address:', error));
            } else {
                document.getElementById('messages').innerHTML += '<li class="chat-outgoing chat"><p>Bot: Client details not found.</p></li>';
            }
        })
        .catch(error => console.error('Error fetching client details:', error));
}
