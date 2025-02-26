<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clermont Tracker | About</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../js/about.js"></script>
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/about.css">
</head>
<body>
    <?php include 'navbar.html'; ?>

    <div class="about-container">
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Clermont</h1>
                <p class="hero-subtitle">An open-source maritime tracking system, designed for self-hosting and community collaboration. Currently in active development.</p>
            </div>
        </section>

        <section class="features-section">
            <div class="feature-card">
                <div class="feature-icon">🌍</div>
                <h3 class="feature-title">Global Coverage</h3>
                <p class="feature-description">Access maritime data from around the world with customizable data sources including AIS, satellite tracking, and more.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Real-time Tracking</h3>
                <p class="feature-description">Monitor vessel movements in real-time with configurable update frequencies based on your hardware capabilities.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <h3 class="feature-title">Self-Hosted</h3>
                <p class="feature-description">Deploy Clermont on your own infrastructure with full control over your data, privacy, and security settings.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🔍</div>
                <h3 class="feature-title">Vessel Information</h3>
                <p class="feature-description">Access detailed vessel data including specifications, ownership records, and historical routes with our expandable plugin system.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🌤️</div>
                <h3 class="feature-title">Weather Integration</h3>
                <p class="feature-description">Overlay weather data from various providers to better understand maritime conditions and improve route planning.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🔄</div>
                <h3 class="feature-title">API Access</h3>
                <p class="feature-description">Integrate Clermont with your existing systems through our comprehensive and well-documented API endpoints.</p>
            </div>
        </section>

        <section class="about-section">
            <div class="about-content">
                <h2 class="section-title">About Clermont</h2>
                <div class="about-description">
                    <p>Clermont is an open-source initiative to democratize access to maritime tracking technology.</p>
                    <p>Named after the first steamboat to successfully navigate American waters, Clermont represents our commitment to innovation and accessibility in maritime technology.</p>
                    <p>By making Clermont open source, we aim to create a community-driven platform that can adapt to the diverse needs of maritime professionals, researchers, and enthusiasts worldwide.</p>
                    <p>Our vision is to build a robust ecosystem of plugins, extensions, and integrations that enhance the core tracking functionality while maintaining ease of deployment and configuration.</p>
                </div>
            </div>
            <div class="about-image"></div>
        </section>

        <section class="development-section">
            <h2 class="section-title">Development Status</h2>
            <p>Clermont is currently in active development with regular updates and improvements. Here's our current roadmap:</p>

            <div class="development-timeline">
                <div class="timeline-item">
                    <div class="timeline-date">Completed</div>
                    <div class="timeline-title">Core Tracking Infrastructure</div>
                    <div class="timeline-description">Basic vessel tracking, map interface, and data processing engine.</div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-date">In Progress</div>
                    <div class="timeline-title">Plugin Architecture</div>
                    <div class="timeline-description">Building a flexible plugin system to allow for community extensions and customizations.</div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-date">In Progress</div>
                    <div class="timeline-title">Documentation & Installation Guides</div>
                    <div class="timeline-description">Comprehensive guides for installation, configuration, and development.</div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-date">Upcoming</div>
                    <div class="timeline-title">Advanced Analytics</div>
                    <div class="timeline-description">Tools for deeper insights into maritime patterns and vessel behaviors.</div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-date">Planned</div>
                    <div class="timeline-title">Mobile Companion App</div>
                    <div class="timeline-description">Native mobile applications to connect to your self-hosted Clermont instance.</div>
                </div>
            </div>
        </section>

        <section class="github-section">
            <h2 class="section-title">Open Source Repository</h2>
            <p>Clermont is freely available on GitHub under the MIT license. We welcome contributions from developers of all skill levels.</p>

            <div class="github-buttons">
                <a href="https://github.com/SageHourihan/clermont" class="github-button">View on GitHub</a>
                <a href="https://github.com/SageHourihan/clermont/issues" class="github-button">Report Issues</a>
            </div>
        </section>

        <section class="installation-section">
            <h2 class="section-title">Quick Installation</h2>
            <p>Clermont is designed to be easy to install on your own LAMP server. Here's a quick guide to get started:</p>

            <div class="code-block">
                <span class="code-comment"># Clone the repository</span><br>
                git clone https://github.com/SageHourihan/clermont<br><br>

                <span class="code-comment"># Navigate to the project directory</span><br>
                cd Clermont<br><br>

                <span class="code-comment"># Set up the database</span><br>
                mysql -u username -p database_name < sql/setup.sql<br><br>

                <span class="code-comment"># Configure your environment</span><br>
                cp config/config.example.php config/config.php<br>
                nano config/config.php<br><br>

                <span class="code-comment"># Set up your web server (example for Apache)</span><br>
                ln -s /path/to/Clermont/public /var/www/html/clermont
            </div>

            <p>For more detailed installation instructions, configuration options, and troubleshooting, please refer to our <a href="documentation.php" style="color: #3B3D54;">documentation</a>.</p>
        </section>

        <section class="contributing-section">
            <h2 class="section-title" style="text-align: center;">Join the Community</h2>
            <p style="text-align: center;">Clermont is made possible by the contributions of developers, maritime experts, and users like you. Here are some ways to get involved:</p>

            <div class="features-section">
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3 class="feature-title">Contribute Code</h3>
                    <p class="feature-description">Submit pull requests to fix bugs, add features, or improve documentation. We welcome contributions of all sizes.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🧪</div>
                    <h3 class="feature-title">Test and Report</h3>
                    <p class="feature-description">Help us identify issues by testing new features and reporting bugs through our GitHub issue tracker.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">💡</div>
                    <h3 class="feature-title">Suggest Features</h3>
                    <p class="feature-description">Share your ideas for new features or improvements to existing functionality.</p>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <h2 class="cta-title">Ready to Get Started with Clermont?</h2>
            <p class="cta-description">Join our growing community of developers and maritime enthusiasts building the future of open-source vessel tracking.</p>

            <div class="cta-buttons">
                <a href="https://github.com/SageHourihan/clermont" class="cta-button">Download Clermont</a>
                <a href="documentation.php" class="cta-button secondary">Read the Docs</a>
            </div>
        </section>
    </div>
</body>
</html>
