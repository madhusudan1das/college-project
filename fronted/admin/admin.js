// Mock Data for the Admin Dashboard

// Removed mockUsers as we will fetch real data from backend

// Removed mockBookings as we removed bookings table

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Security Check: Verify Admin
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        // No user found, redirect to login
        window.location.href = "../sing in/login.html";
        return;
    }

    const user = JSON.parse(userStr);
    if (!user.isAdmin || user.email !== "admin@gmail.com") {
        // Logged in but not an admin, redirect to homepage
        window.location.href = "../index.html";
        return;
    }

    // User is verified Admin. Proceed to load dashboard.

    // 2. Tab Switching Logic
    const navLinks = document.querySelectorAll('.nav-links a[data-target]');
    const viewSections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked link
            link.classList.add('active');

            // Hide all views
            viewSections.forEach(view => {
                view.style.display = 'none';
                view.classList.remove('active');
            });

            // Show targeted view
            const targetId = link.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.style.display = 'block';
                targetView.classList.add('active');
            }
        });
    });

    // 3. Fetch and Populate Users
    const customersList = document.getElementById("customers-list");
    const usersTableBody = document.getElementById("users-table-body");
    
    if(customersList) customersList.innerHTML = '<p style="padding: 1rem;">Loading...</p>';
    if(usersTableBody) usersTableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    
    try {
        const response = await fetch('http://localhost:5000/api/admin/users');
        const data = await response.json();
        
        if (response.ok) {
            // Update total users count
            document.getElementById("total-users").textContent = (data.count || 0).toLocaleString();
            
            
            // Populate list and table
            if(customersList) customersList.innerHTML = '';
            if(usersTableBody) usersTableBody.innerHTML = '';
            
            const usersToShow = data.users || [];
            
            if (usersToShow.length === 0) {
                if(customersList) customersList.innerHTML = '<p style="padding: 1rem;">No customers found.</p>';
                if(usersTableBody) usersTableBody.innerHTML = '<tr><td colspan="3">No customers found.</td></tr>';
            } else {
                usersToShow.forEach(u => {
                    // Dashboard Customers List
                    if(customersList) {
                        const div = document.createElement("div");
                        div.className = "customer";
                        div.innerHTML = `
                            <div class="info">
                                <i class='bx bxs-user-circle' style="font-size: 40px; color: #cbd5e1;"></i>
                            </div>
                            <div class="customer-info">
                                <h4>${u.name}</h4>
                                <small>${u.email}</small>
                            </div>
                        `;
                        customersList.appendChild(div);
                    }

                    // Users View Table
                    if(usersTableBody) {
                        const row = document.createElement("tr");
                        const dateStr = u.date ? new Date(u.date).toLocaleDateString() : 'N/A';
                        row.innerHTML = `
                            <td>${u.name}</td>
                            <td>${u.email}</td>
                            <td>${dateStr}</td>
                        `;
                        usersTableBody.appendChild(row);
                    }
                });
            }
        } else {
            console.error("Failed to fetch users", data);
            if(customersList) customersList.innerHTML = '<p style="padding: 1rem; color: red;">Failed to load customers.</p>';
            if(usersTableBody) usersTableBody.innerHTML = '<tr><td colspan="3">Error loading users.</td></tr>';
            document.getElementById("total-users").textContent = "Error";
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        if(customersList) customersList.innerHTML = '<p style="padding: 1rem; color: red;">Error connecting to server.</p>';
        if(usersTableBody) usersTableBody.innerHTML = '<tr><td colspan="3">Error loading users.</td></tr>';
        document.getElementById("total-users").textContent = "Error";
    }

    // 4. Fetch and Populate Inquiries
    const inquiriesTableBody = document.getElementById("inquiries-table-body");
    if(inquiriesTableBody) inquiriesTableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        const response = await fetch('http://localhost:5000/api/admin/inquiries');
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById("total-inquiries").textContent = (data.count || 0).toLocaleString();
            
            if(inquiriesTableBody) {
                inquiriesTableBody.innerHTML = '';
                const inquiriesToShow = data.inquiries || [];
                
                if (inquiriesToShow.length === 0) {
                    inquiriesTableBody.innerHTML = '<tr><td colspan="4">No inquiries found.</td></tr>';
                } else {
                    inquiriesToShow.forEach(inq => {
                        const row = document.createElement("tr");
                        const dateStr = inq.date ? new Date(inq.date).toLocaleString() : 'N/A';
                        row.innerHTML = `
                            <td>${inq.name}</td>
                            <td>${inq.email}</td>
                            <td>${inq.message}</td>
                            <td>${dateStr}</td>
                        `;
                        inquiriesTableBody.appendChild(row);
                    });
                }
            }
        } else {
            console.error("Failed to fetch inquiries", data);
            if(inquiriesTableBody) inquiriesTableBody.innerHTML = '<tr><td colspan="4">Failed to load inquiries.</td></tr>';
            document.getElementById("total-inquiries").textContent = "Error";
        }
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        if(inquiriesTableBody) inquiriesTableBody.innerHTML = '<tr><td colspan="4">Error connecting to server.</td></tr>';
        document.getElementById("total-inquiries").textContent = "Error";
    }

    // 5. Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "../sing in/login.html";
        });
    }
});
