import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const tabs = [
    { key: "general", label: "General" },
    { key: "users", label: "Users" },
    { key: "notifications", label: "Notifications" },
    { key: "integrations", label: "Integrations" },
    { key: "security", label: "Security" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className="flex gap-1 bg-secondary rounded-md p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && <GeneralSettings />}
      {activeTab === "users" && <UserSettings />}
      {activeTab === "notifications" && <NotificationSettings />}
      {activeTab === "integrations" && <IntegrationSettings />}
      {activeTab === "security" && <SecuritySettings />}
    </div>
  );
};

const GeneralSettings = () => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
    <p className="text-sm text-muted-foreground">Manage your shelter's basic information and preferences.</p>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Shelter Name" value="Happy Paws Animal Shelter" />
      <Field label="Contact Email" value="contact@happypaws.com" />
      <Field label="Phone Number" value="+1 (555) 123-4567" />
      <Field label="Address" value="123 Shelter Street, Animal City, AC 12345" />
      <Field label="Timezone" value="Eastern Time (UTC-5)" />
      <Field label="Currency" value="US Dollar (USD)" />
      <Field label="Language" value="English" />
    </div>
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">Shelter Description</label>
      <textarea defaultValue="A loving shelter dedicated to finding forever homes for animals in need" rows={2} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y" />
      <p className="text-xs text-muted-foreground">Brief description of your shelter that will appear on public pages.</p>
    </div>
    <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">Save Changes</button>
  </div>
);

const UserSettings = () => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
      <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-lg font-medium text-muted-foreground">JD</span>
      </div>
      <button className="border border-border rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-secondary">Change Avatar</button>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Username" value="johndoe" />
      <Field label="Email" value="john@example.com" />
      <Field label="Full Name" value="John Doe" />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Role</label>
        <select defaultValue="Staff" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option>Staff</option>
          <option>Admin</option>
          <option>Volunteer</option>
        </select>
      </div>
    </div>
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">Bio</label>
      <input defaultValue="Animal care specialist with 5 years of experience." className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
    </div>
    <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">Save Changes</button>
  </div>
);

const NotificationSettings = () => {
  const notifications = [
    { label: "Email Notifications", desc: "Receive notifications via email", default: true },
    { label: "Animal Updates", desc: "Get updates about animals in your care.", default: true },
    { label: "Medical Alerts", desc: "Receive alerts for medical appointments and treatments.", default: true },
    { label: "Adoption Requests", desc: "Get notified about new adoption requests.", default: false },
    { label: "Task Assignments", desc: "Receive notifications for new task assignments.", default: true },
    { label: "System Announcements", desc: "Important system-wide announcements.", default: true },
    { label: "Daily Reports", desc: "Receive daily summary reports.", default: false },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">Choose what notifications you want to receive.</p>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.label} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={n.default} className="sr-only peer" />
              <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const IntegrationSettings = () => {
  const integrations = [
    { label: "Email Service", desc: "Integration with email service provider.", field: "Email Service API Key", connected: true },
    { label: "SMS Service", desc: "Integration with SMS provider for notifications.", field: null, connected: false },
    { label: "Calendar Sync", desc: "Sync with external calendar services.", field: "Calendar API Key", connected: false },
    { label: "Payment Gateway", desc: "Integration with payment processing service.", field: "Payment Gateway API Key", connected: true },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Integration Settings</h2>
        <p className="text-sm text-muted-foreground">Configure external service integrations and API keys.</p>
      </div>
      {integrations.map((int) => (
        <div key={int.label} className="space-y-2 pb-4 border-b border-border last:border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{int.label}</p>
              <p className="text-xs text-muted-foreground">{int.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={int.connected} className="sr-only peer" />
              <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
          {int.field && (
            <input placeholder={int.field} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          )}
        </div>
      ))}
      <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">Save Integration Settings</button>
    </div>
  );
};

const SecuritySettings = () => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
      <p className="text-sm text-muted-foreground">Manage your account security and authentication preferences.</p>
    </div>
    <div className="space-y-4">
      <Field label="Current Password" value="" type="password" />
      <Field label="New Password" value="" type="password" />
      <Field label="Confirm New Password" value="" type="password" />
    </div>
    <div className="space-y-3 pt-2">
      <ToggleItem label="Two-Factor Authentication" desc="Add an extra layer of security to your account." />
      <ToggleItem label="Session Timeout" desc="Automatically log out after period of inactivity." />
      <ToggleItem label="Login Notifications" desc="Get notified of new login attempts." />
    </div>
    <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">Update Security Settings</button>
  </div>
);

const Field = ({ label, value, type = "text" }: { label: string; value: string; type?: string }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <input type={type} defaultValue={value} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
  </div>
);

const ToggleItem = ({ label, desc }: { label: string; desc: string }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
    </label>
  </div>
);

export default SettingsPage;
