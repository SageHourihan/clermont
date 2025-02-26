<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/about.css">
    <link rel="stylesheet" href="../css/contact.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../js/contact.js"></script>
</head>
<body>
    <?php include 'navbar.html'; ?>

    <div class="about-container">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Get In Touch</h1>
                <p class="hero-subtitle">Have questions about the project or want to contribute? We'd love to hear from you. Use the form below or reach out through one of our channels.</p>
            </div>
        </section>

        <!-- Contact Options Section -->
        <section class="features-section">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3 class="feature-title">Email Us</h3>
                <p class="feature-description">Send us an email directly and we'll get back to you as soon as possible.</p>
                <p class="feature-contact"><a href="mailto:samiho97@gmail.com">samiho97@gmail.com</a></p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fab fa-github"></i>
                </div>
                <h3 class="feature-title">GitHub</h3>
                <p class="feature-description">Check out our repository, open issues, or contribute to the project.</p>
                <p class="feature-contact"><a href="https://github.com/SageHourihan/clermont" target="_blank">https://github.com/SageHourihan/clermont</a></p>
            </div>

            <!-- <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h3 class="feature-title">Community</h3>
                <p class="feature-description">Join our community discussions and get help from other users.</p>
                <p class="feature-contact"><a href="#" target="_blank">Join Discord</a> or <a href="#" target="_blank">Forum</a></p>
            </div> -->
        </section>

        <!-- Contact Form Section -->
        <section class="development-section contact-form-section">
            <h2 class="section-title">Contact Form</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>

            <form id="contactForm" action="process_contact.php" method="POST">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required>
                </div>

                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="6" required></textarea>
                </div>

                <div class="form-submit">
                    <button type="submit" id="submitBtn" class="github-button">Send Message</button>
                </div>

                <div id="formResponse"></div>
            </form>
        </section>

        <!-- GitHub Section -->
        <section class="github-section">
            <h2 class="section-title">Visit Our GitHub Repository</h2>
            <p>Explore our code, contribute to the project, or report issues directly on GitHub.</p>
            <div class="github-buttons">
                <a href="https://github.com/SageHourihan/clermont" target="_blank" class="github-button">View Repository</a>
                <a href="https://github.com/SageHourihan/clermont/issues" target="_blank" class="github-button">Report Issue</a>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <h2 class="cta-title">Join Our Development Effort</h2>
            <p class="cta-description">Interested in contributing to the project? We welcome developers, designers, testers, and documentation writers to help make this project even better.</p>
            <div class="cta-buttons">
                <a href="#" class="cta-button">Contribute Now</a>
                <a href="#" class="cta-button secondary">Learn More</a>
            </div>
        </section>
    </div>
</body>
</html>
