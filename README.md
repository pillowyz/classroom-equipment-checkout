### Prerequisites

Before you begin, ensure you have the following installed:

- **XAMPP** (includes Apache, MySQL, and PHP)
  - Download from: https://www.apachefriends.org/
- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/
- **Web Browser** (Chrome, Firefox, or Safari)
- **Code Editor** (VS Code recommended)

### Installation

#### 1. Clone the Repository

**For Mac:**
```bash
cd /Applications/XAMPP/htdocs/
git clone https://github.com/pillowyz/classroom-equipment-checkout.git
cd classroom-equipment-checkout
```

**For Windows:**
```bash
cd C:\xampp\htdocs\
git clone https://github.com/pillowyz/classroom-equipment-checkout.git
cd classroom-equipment-checkout
```
#### 2. Start XAMPP Services

1. Open XAMPP Control Panel
2. Click **Start** for Apache
3. Click **Start** for MySQL
4. Ensure both show "Running" status (green)

#### 3. Set Up Database

1. Open browser and go to: `http://localhost/phpmyadmin`
2. Click **"New"** in the left sidebar
3. Create database named: `equipment`
4. Click on the `equipment` database
5. Click **"Import"** tab
6. Click **"Choose File"** and select: `database/equipment_database.sql`
7. Click **"Go"** at the bottom
8. Wait for "Import has been successfully finished" message

#### 4. Verify Database

Check that these tables were created:
- `devices` (6 sample devices)
- `student` (1 test student)
- `transactions` (sample transactions)

#### 5. Open the Application

1. Open web browser
2. Navigate to: `http://localhost/classroom-equipment-checkout/frontend/index.html`
3. You should see the login page!

### Test Credentials

Use these credentials to test the application:

- **Email:** `student@email.com`
- **Password:** `studentpassword`
- **2FA Code:** Any 6-digit number (e.g., `123456`)

> 📝 Note: In development mode, any 6-digit code will work for 2FA. In production, actual codes would be sent via email.

## 📖 Usage

### Logging In

1. Enter your student email and password
2. Click "Sign In"
3. Enter the 6-digit verification code sent to your email
4. Click "Verify"

### Browsing Equipment

1. Click the **"Browse Equipment"** tab
2. View available equipment with status indicators:
   - 🟢 **Available** - Ready to checkout
   - 🟠 **Unavailable** - Currently in use
3. See last checkout dates and equipment details

### Checking Out Equipment

1. Click the **"Checkout"** tab
2. Select equipment from the dropdown menu
3. Click **"Checkout Equipment"**
4. Confirmation message will appear
5. Equipment status automatically updates to "Checked Out"

### Viewing Your Items

1. Click the **"My Items"** tab
2. See all equipment you currently have checked out
3. View checkout dates and expected return dates

### Returning Equipment

1. Go to **"My Items"** tab
2. Find the item you want to return
3. Click the **"Return"** button
4. Confirm the return
5. Equipment status automatically updates to "Available"

### Logging Out

1. Click the **"Logout"** button in the top right
2. You'll be redirected to the login page
3. All session data is cleared
