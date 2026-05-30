
/**
 * Simulación completa del flujo de una conferencia en ComfyChair.
 * Recorre las 5 etapas: Receiving → Bidding → Assignment → Reviewing → Selection
 *
 * Ejecutar con: node simulacion.js
 */

const Stages = require('./src/constants/Stages');
const Interests = require('./src/constants/Interests');

const User = require('./src/User');
const Session = require('./src/Session');
const Paper = require('./src/Paper');
const { Bid } = require('./src/Bid');
const Conference = require('./src/Conference');
const RegularPaper = require('./src/RegularPaper');
const Poster = require('./src/Poster');

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────

let conference, sessionServerless, sessionBucketS3;
let user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12, user13, user14, user15;
let paper1, paper2, paper3;

function setupConference() {
    // ### 1 CONFERENCIA
    conference = new Conference("AWS 2026");

    // ### 2 USUARIOS
    user1  = new User("Alice Smith",        "University of AWS",   "alice.smith@aws.com",        "1234");
    user2  = new User("Bob Johnson",        "AWS Research Lab",    "bob.johnson@aws.com",        "5678");
    user3  = new User("Charlie Brown",      "AWS Innovators",      "charlie.brown@aws.com",      "9101");
    user4  = new User("Diana Prince",       "AWS Cloud Experts",   "diana.prince@aws.com",       "1121");
    user5  = new User("Ethan Hunt",         "AWS Security Team",   "ethan.hunt@aws.com",         "3141");
    user6  = new User("Fiona Gallagher",    "AWS DevOps",          "fiona.gallagher@aws.com",    "5161");
    user7  = new User("George Martin",      "AWS AI Lab",          "george.martin@aws.com",      "7181");
    user8  = new User("Hannah Baker",       "AWS Data Science",    "hannah.baker@aws.com",       "9202");
    user9  = new User("Ian Fleming",        "AWS IoT",             "ian.fleming@aws.com",        "1223");
    user10 = new User("Jack Ryan",          "AWS Security",        "jack.ryan@aws.com",          "3245");
    user11 = new User("Karen Page",         "AWS Cloud",           "karen.page@aws.com",         "5267");
    user12 = new User("Leo Messi",          "AWS AI",              "leo.messi@aws.com",          "7289");
    user13 = new User("Cristiano Ronaldo",  "AWS Data",            "cristiano.ronaldo@aws.com",  "9301");
    user14 = new User("Nina Dobrev",        "AWS DevOps",          "nina.dobrev@aws.com",        "1324");
    user15 = new User("Oscar Isaac",        "AWS IoT",             "oscar.isaac@aws.com",        "3546");

    // ### 3 CHAIRS A CONFERENCIA
    conference.addChair(user1);
    conference.addChair(user5);
}

function setupSessions() {
    // ### 4 SESSIONS
    sessionServerless = new Session("Serverless architecture");

    sessionBucketS3 = new Session("S3 bucket management");

    // ### 5 - AGREGAR LAS SESSIONES A LA CONFERENCIA
    conference.addSession(sessionServerless);
    conference.addSession(sessionBucketS3);
}

function setupReviewers() {
    // revisores a la session Serverless architecture
    sessionServerless.addReviewer(user2);
    sessionServerless.addReviewer(user3);
    sessionServerless.addReviewer(user4);
    sessionServerless.addReviewer(user6);
    sessionServerless.addReviewer(user7);

    // revisores a la session S3 bucket management
    sessionBucketS3.addReviewer(user8);
    sessionBucketS3.addReviewer(user9);
    sessionBucketS3.addReviewer(user10);
}

function displayConferenceInfo() {
    console.log("\nConference:", conference.name());

    console.log("Chairs de Conferencia:");
    console.table(conference.chairs().map(u => ({ Name: u.getFullName(), Affiliation: u.getAffiliation(), Email: u.getEmail() })));

    console.log("\nSessions de Conferencia:");
    console.table(conference.sessions().map(s => ({ Name: s.name(), Reviewers: s.reviewers().length })));

    console.log(`\nReviewers de session "${sessionServerless.name()}":`);
    console.table(sessionServerless.reviewers().map(r => ({ Name: r.getFullName(), Affiliation: r.getAffiliation(), Email: r.getEmail() })));

    console.log(`\nReviewers de session "${sessionBucketS3.name()}":`);
    console.table(sessionBucketS3.reviewers().map(r => ({ Name: r.getFullName(), Affiliation: r.getAffiliation(), Email: r.getEmail() })));
}

// ─── ETAPA 1: RECEIVING ──────────────────────────────────────────────────────

function submitPapers() {
    // ### 6 - CREAR PAPERS Y ENVIARLOS A LAS SESSIONS
    paper1 = new Paper("Serverless security best practices", [user10, user11], user10);

    paper2 = new RegularPaper(
        "Serverless monitoring and observability",
        [user14, user15],
        user14,
        "This paper explores monitoring and observability strategies for serverless architectures, covering distributed tracing, log aggregation, and metrics collection to improve reliability and performance of cloud-native applications."
    );

    paper3 = new Poster(
        "S3 bucket cost optimization strategies",
        [user8, user9],
        user8,
        "https://example.com/s3-cost-optimization-poster.pdf",
        "https://example.com/s3-cost-optimization-poster-thumbnail.pdf"
    );

    sessionServerless.submit(paper1);
    sessionServerless.submit(paper2);
    sessionBucketS3.submit(paper3);

    // Modificar el abstract de paper2 durante Receiving (los envios pueden modificarse antes del cierre)
    console.log("\nModificando el abstract de paper2 durante la etapa Receiving...");
    paper2.setAbstract("This paper explores monitoring and observability strategies for serverless architectures, covering distributed tracing, log aggregation, and metrics collection. Updated to include comparison with existing tools and real-world benchmarks.");
    sessionServerless.updatePaper(paper2);
    console.log("Abstract actualizado correctamente durante Receiving.");
}

// ─── ETAPA 2: BIDDING ────────────────────────────────────────────────────────

function processBidding() {
    // Modificar el estado de la session Serverless architecture a "Bidding"
    // -> no se pueden enviar mas Papers
    // -> se pueden ingresar ofertas (bids) para los papers enviados
    sessionServerless.closeSubmissions();

    // mostrar que no se pueden enviar mas papers a la session Serverless architecture
    try {
        console.log("\n### Logica de Negocio: No se pueden enviar mas papers a la session Serverless architecture despues de cerrar las submissions.");
        console.log("Intentando enviar un nuevo paper a la session Serverless architecture después de cerrar las submissions...");
        sessionServerless.submit(new RegularPaper("New paper after closing submissions", [user12], user12, "Abstract of paper submitted after closing."));
    } catch (error) {
        console.error("Error al enviar paper después de cerrar las submissions:", error.message);
    }

    // mostrar que no se pueden modificar papers después de cerrar las submissions
    try {
        console.log("\n### Logica de Negocio: No se pueden modificar papers después de cerrar las submissions.");
        console.log("Intentando modificar paper2 después de cerrar las submissions...");
        sessionServerless.updatePaper(paper2);
    } catch (error) {
        console.error("Error al modificar paper después de cerrar las submissions:", error.message);
    }

    // mostrar esta de bidding ingresando ofertas (bids) para los papers enviados a la session Serverless architecture
    console.log("\nIngresando ofertas (bids) para los papers enviados a la session Serverless architecture...");
    sessionServerless.enterBid(paper1, user2, Interests.Interested);
    sessionServerless.enterBid(paper1, user3, Interests.Maybe);
    sessionServerless.enterBid(paper1, user4, Interests.NotInterested);
    sessionServerless.enterBid(paper1, user6, Interests.Interested);
    sessionServerless.enterBid(paper1, user7, Interests.Maybe);

    sessionServerless.enterBid(paper2, user2, Interests.Maybe);
    sessionServerless.enterBid(paper2, user3, Interests.Interested);
    sessionServerless.enterBid(paper2, user4, Interests.Interested);
    sessionServerless.enterBid(paper2, user6, Interests.NotInterested);
    sessionServerless.enterBid(paper2, user7, Interests.Interested);

    console.log(`Ofertas(bids) por Session "${sessionServerless.name()}":`);
    console.table(sessionServerless.bids().map((bid) => ({
        Paper:    bid.paper().title(),
        Reviewer: bid.reviewer().getFullName(),
        Interest: bid.interest().description
    })));

    // cerrar submissions e ingresar bids para S3 bucket management
    // (user8 y user9 son autores de paper3 -> seran excluidos en la asignacion por conflicto de interes)
    sessionBucketS3.closeSubmissions();
    sessionBucketS3.enterBid(paper3, user8,  Interests.Interested);
    sessionBucketS3.enterBid(paper3, user9,  Interests.Maybe);
    sessionBucketS3.enterBid(paper3, user10, Interests.Interested);

    console.log(`\nOfertas(bids) por Session "${sessionBucketS3.name()}":`);
    console.table(sessionBucketS3.bids().map((bid) => ({
        Paper:    bid.paper().title(),
        Reviewer: bid.reviewer().getFullName(),
        Interest: bid.interest().description
    })));
}

// ─── ETAPA 3: ASSIGNMENT ────────────────────────────────────────────────────

function processAssignment() {
    // Modificar el estado de la session Serverless architecture a "Assignment"
    // -> no se pueden ingresar mas ofertas (bids)
    // -> la asignacion de revisores se realiza automaticamente segun prioridad de bids (Interested > Maybe > sin bid > NotInterested)
    sessionServerless.closeBidding();

    // Intento de ingresar una nueva oferta (bid) para un Paper después de cerrar el bidding
    try {
        console.log("\n### Logica de Negocio: No se pueden ingresar ofertas (bids) para los papers de la session Serverless architecture despues de cerrar el bidding.");
        console.log("Intentando ingresar una nueva oferta (bid) para un paper después de cerrar el bidding...");
        sessionServerless.enterBid(paper1, user2, Interests.Interested);
    } catch (error) {
        console.error("Error al ingresar oferta (bid) después de cerrar el bidding:", error.message);
    }

    // Mostrar los revisores asignados automaticamente a cada paper
    const assignmentRows = sessionServerless.papers().flatMap((paper) => {
        const assigned = sessionServerless.assignmentsFor(paper);
        return assigned.map((reviewer) => {
            const bid = sessionServerless.bidFor(paper, reviewer);
            return {
                Paper:    paper.title(),
                Revisor:  reviewer.getFullName(),
                Oferta:   bid ? bid.interest().description : "sin bid",
            };
        });
    });
    console.log("\nAsignacion automatica de revisores (Interested > Maybe > sin bid > NotInterested):");
    console.table(assignmentRows);

    // cerrar bidding y mostrar asignacion para S3 bucket management
    // user8 y user9 son autores de paper3 -> excluidos por conflicto de interes -> solo user10 asignado
    sessionBucketS3.closeBidding();

    const assignmentRowsS3 = sessionBucketS3.papers().flatMap((paper) => {
        const assigned = sessionBucketS3.assignmentsFor(paper);
        return assigned.map((reviewer) => {
            const bid = sessionBucketS3.bidFor(paper, reviewer);
            return {
                Paper:   paper.title(),
                Revisor: reviewer.getFullName(),
                Oferta:  bid ? bid.interest().description : "sin bid",
            };
        });
    });
    console.log(`\nAsignacion automatica en "${sessionBucketS3.name()}" (user8/user9 excluidos por conflicto de interes):`);
    console.table(assignmentRowsS3);
}

// ─── ETAPA 4: REVIEWING ─────────────────────────────────────────────────────

function processReviews() {
    // Cerrar la etapa de asignacion y pasar a la etapa de Reviewing
    // -> los revisores asignados pueden cargar sus revisiones
    sessionServerless.closeAssignment();

    // Los revisores asignados cargan sus revisiones para cada paper
    console.log("\nCargando revisiones de los revisores asignados...");
    const assignedPaper1 = sessionServerless.assignmentsFor(paper1);
    sessionServerless.submitReview(paper1, assignedPaper1[0], "Strong security model, well-argued IAM design.",          2);
    sessionServerless.submitReview(paper1, assignedPaper1[1], "Good but lacks concrete benchmarks.",                     1);
    sessionServerless.submitReview(paper1, assignedPaper1[2], "Interesting approach, minor issues with threat modeling.", 3);

    const assignedPaper2 = sessionServerless.assignmentsFor(paper2);
    sessionServerless.submitReview(paper2, assignedPaper2[0], "Comprehensive tracing coverage.",                        3);
    sessionServerless.submitReview(paper2, assignedPaper2[1], "Good metrics section, weak conclusion.",                 1);
    sessionServerless.submitReview(paper2, assignedPaper2[2], "Solid work, missing comparison with related work.",      2);

    // Mostrar las revisiones cargadas por paper
    const reviewRows = [];
    sessionServerless.papers().forEach((paper) => {
        paper.reviews().forEach((review) => {
            reviewRows.push({
                Paper:    paper.title(),
                Reviewer: review.reviewer().getFullName(),
                Score:    review.score(),
                Text:     review.text(),
            });
        });
    });
    console.log(`\nRevisiones cargadas en session "${sessionServerless.name()}":`);
    console.table(reviewRows);

    // cerrar asignacion y cargar revision para S3 bucket management
    // solo 1 revisor asignado (user10) por conflicto de interes de user8 y user9
    sessionBucketS3.closeAssignment();
    sessionBucketS3.assignmentsFor(paper3).forEach((reviewer) => {
        sessionBucketS3.submitReview(paper3, reviewer, "Solid poster, good cost breakdown and clear visuals.", 3);
    });

    const reviewRowsS3 = [];
    sessionBucketS3.papers().forEach((paper) => {
        paper.reviews().forEach((review) => {
            reviewRowsS3.push({
                Paper:    paper.title(),
                Reviewer: review.reviewer().getFullName(),
                Score:    review.score(),
                Text:     review.text(),
            });
        });
    });
    console.log(`\nRevisiones cargadas en session "${sessionBucketS3.name()}" (1 revisor por conflicto de interes):`);
    console.table(reviewRowsS3);
}

// ─── ETAPA 5: SELECTION ─────────────────────────────────────────────────────

function processSelection() {
    // Cerrar la etapa de revision y pasar a etapa de Seleccion
    sessionServerless.closeReviewing();

    // Seleccionar los articulos aceptados por corte fijo del 60%
    const acceptancePercentage = 60;
    sessionServerless.selectPapers(acceptancePercentage);

    // Mostrar resultado de la seleccion
    const selectionRows = sessionServerless.papers()
        .slice()
        .sort((a, b) => b.score() - a.score())
        .map((paper) => ({
            Paper:    paper.title(),
            Score:    paper.score().toFixed(2),
            Accepted: sessionServerless.acceptedPapers().includes(paper) ? "Si" : "No",
        }));

    console.log(`\nSeleccion de articulos (corte fijo ${acceptancePercentage}%) en session "${sessionServerless.name()}":`);
    console.table(selectionRows);

    // cerrar reviewing y seleccionar papers para S3 bucket management
    sessionBucketS3.closeReviewing();
    sessionBucketS3.selectPapers(acceptancePercentage);

    const selectionRowsS3 = sessionBucketS3.papers()
        .slice()
        .sort((a, b) => b.score() - a.score())
        .map((paper) => ({
            Paper:    paper.title(),
            Score:    paper.score().toFixed(2),
            Accepted: sessionBucketS3.acceptedPapers().includes(paper) ? "Si" : "No",
        }));

    console.log(`\nSeleccion de articulos (corte fijo ${acceptancePercentage}%) en session "${sessionBucketS3.name()}":`);
    console.table(selectionRowsS3);
}

// ─── EJECUCIÓN ───────────────────────────────────────────────────────────────

function execute() {
    // -- configuración inicial --
    setupConference();
    setupSessions();
    setupReviewers();
    displayConferenceInfo();

    submitPapers();       // Etapa 1: Receiving
    processBidding();     // Etapa 2: Bidding
    processAssignment();  // Etapa 3: Assignment
    processReviews();     // Etapa 4: Reviewing
    processSelection();   // Etapa 5: Selection
}

execute();

