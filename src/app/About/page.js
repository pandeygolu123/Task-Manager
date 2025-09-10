"use client";

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="title">About This App</h1>
      <p className="subtitle">
        This Task Management App helps you organize your daily work.
      </p>

      <section className="section">
        <h2>Features</h2>
        <ul>
          <li>Dashboard with task summary</li>
          <li>Add and manage tasks</li>
          <li>Calendar integration</li>
          <li>Reports for progress tracking</li>
        </ul>
      </section>

    </div>
  );
}
