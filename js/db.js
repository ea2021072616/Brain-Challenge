/**
 * DB Module - Questions and Categories Database
 * Brain Challenge — UPT CATEC 2026-I
 */
const DB = (() => {
  const categorias = [
    { id: 'videojuegos',   name: 'Videojuegos',              shortName: 'Videojuegos',     icon: 'gamepad-2' },
    { id: 'programacion',  name: 'Lógica de Programación',   shortName: 'Programación',    icon: 'code-2' },
    { id: 'basedatos',     name: 'Base de Datos',            shortName: 'Base de Datos',   icon: 'database' },
    { id: 'culturagen',    name: 'Cultura General Carrera',  shortName: 'Cultura General', icon: 'graduation-cap' },
    { id: 'redes',         name: 'Redes y Protocolos',       shortName: 'Redes y Prot.',   icon: 'network' },
    { id: 'metodologias',  name: 'Metodologías de Desarrollo',shortName: 'Metodologías',   icon: 'git-branch' },
    { id: 'anime',         name: 'Anime',                    shortName: 'Anime',           icon: 'sparkles' },
  ];

  const preguntas = {
    videojuegos: [
      { q: '¿En qué año se lanzó el primer juego de la saga "The Legend of Zelda"?', opts: ['1986', '1985', '1988', '1990'], ans: 0 },
      { q: '¿Cuál es el nombre del protagonista de la saga "God of War"?', opts: ['Zeus', 'Kratos', 'Ares', 'Leonidas'], ans: 1 },
      { q: '¿Qué compañía desarrolló el juego "Minecraft"?', opts: ['Bethesda', 'Mojang', 'EA', 'Valve'], ans: 1 },
      { q: '¿Cómo se llama la princesa que rescata Mario en la mayoría de juegos?', opts: ['Daisy', 'Rosalina', 'Peach', 'Pauline'], ans: 2 },
      { q: '¿Cuántos pokémon originales existen en la 1ª generación?', opts: ['100', '150', '151', '152'], ans: 2 },
      { q: '¿En qué ciudad ficticia se ambienta GTA V?', opts: ['Vice City', 'Liberty City', 'Los Santos', 'San Fierro'], ans: 2 },
      { q: '¿Qué género define a "Dark Souls"?', opts: ['MMORPG', 'Battle Royale', 'Soulslike RPG', 'Plataformas'], ans: 2 },
      { q: '¿Qué consola introdujo los juegos en CD de Sony?', opts: ['PS2', 'PS1', 'SNES CD', 'Saturn'], ans: 1 },
      { q: '¿Cuál fue el primer juego de la saga "Call of Duty"?', opts: ['CoD 2', 'CoD: Finest Hour', 'Call of Duty (2003)', 'CoD: Modern Warfare'], ans: 2 },
      { q: '¿Qué personaje dice la frase "It\'s dangerous to go alone!"?', opts: ['Link', 'Zelda', 'Ganondorf', 'El anciano'], ans: 3 },
      { q: '¿En qué año se fundó Nintendo?', opts: ['1889', '1950', '1969', '1975'], ans: 0 },
      { q: '¿Qué juego popular de Battle Royale incluye construir y destruir estructuras?', opts: ['Apex Legends', 'Fortnite', 'PUBG', 'Warzone'], ans: 1 },
      { q: '¿Cómo se llama el reino principal en la saga "Super Mario"?', opts: ['Reino del Champiñón', 'Hyrule', 'Dream Land', 'Kanto'], ans: 0 },
      { q: '¿Qué personaje es conocido como la "Mascota de Sega"?', opts: ['Sonic el Erizo', 'Alex Kidd', 'Tails', 'Knuckles'], ans: 0 },
      { q: '¿Cuál es la consola de videojuegos doméstica más vendida de todos los tiempos?', opts: ['PlayStation 4', 'Nintendo Switch', 'PlayStation 2', 'Wii'], ans: 2 }
    ],
    programacion: [
      { q: '¿Cuál es la complejidad temporal del algoritmo de búsqueda binaria?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2 },
      { q: '¿Qué estructura de datos usa el principio LIFO?', opts: ['Cola', 'Pila (Stack)', 'Lista enlazada', 'Árbol'], ans: 1 },
      { q: '¿Qué devuelve la función booleana: (true && false || true)?', opts: ['false', 'true', 'null', 'error'], ans: 1 },
      { q: '¿Cuál es el resultado de 7 % 3 en la mayoría de lenguajes?', opts: ['2', '1', '3', '0'], ans: 1 },
      { q: '¿Qué paradigma usa Python principalmente?', opts: ['Solo funcional', 'Solo OOP', 'Multiparadigma', 'Solo imperativo'], ans: 2 },
      { q: '¿Cuál es el número de nodos en un árbol binario completo de altura 3?', opts: ['7', '15', '8', '14'], ans: 1 },
      { q: '¿Qué significa DRY en programación?', opts: ["Don't Repeat Yourself", 'Do Repeat Yourself', 'Dynamic Runtime Yield', 'Dry Run Yourself'], ans: 0 },
      { q: '¿Qué algoritmo de ordenamiento tiene mejor caso O(n log n) garantizado?', opts: ['Quicksort', 'Bubble sort', 'Merge sort', 'Insertion sort'], ans: 2 },
      { q: '¿Cuánto es 2^10?', opts: ['512', '1024', '2048', '256'], ans: 1 },
      { q: '¿Qué es un puntero en C?', opts: ['Un tipo de loop', 'Una variable que almacena una dirección de memoria', 'Un array de caracteres', 'Un tipo de dato float'], ans: 1 },
      { q: '¿Qué estructura usa el principio FIFO?', opts: ['Pila', 'Árbol binario', 'Cola (Queue)', 'Grafo'], ans: 2 },
      { q: '¿Cuál es la complejidad de buscar un elemento en un Hash Map en el caso promedio?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], ans: 0 },
      { q: '¿Qué palabra clave se usa en JavaScript para declarar una variable de ámbito de bloque reasignable?', opts: ['var', 'let', 'const', 'global'], ans: 1 },
      { q: '¿Cuál es el valor del número binario 1010 en base decimal?', opts: ['8', '12', '10', '6'], ans: 2 },
      { q: '¿Qué operador lógico representa el "O" exclusivo (XOR)?', opts: ['||', '&&', '^', '!'], ans: 2 }
    ],
    basedatos: [
      { q: '¿Qué sentencia SQL se usa para recuperar datos de una tabla?', opts: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], ans: 2 },
      { q: '¿Cuál es la forma normal que elimina dependencias parciales?', opts: ['1FN', '2FN', '3FN', 'FNBC'], ans: 1 },
      { q: '¿Qué tipo de JOIN devuelve todos los registros de ambas tablas?', opts: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], ans: 3 },
      { q: '¿Qué significa ACID en bases de datos?', opts: ['Atomicity Consistency Isolation Durability', 'Application Code Integration Design', 'Active Copy Index Data', 'Async Cache Index Durability'], ans: 0 },
      { q: '¿Cuál es la clave que identifica de forma única cada fila en una tabla?', opts: ['Foreign Key', 'Primary Key', 'Index', 'Unique Key'], ans: 1 },
      { q: '¿Qué comando crea una nueva tabla en SQL?', opts: ['NEW TABLE', 'MAKE TABLE', 'CREATE TABLE', 'ADD TABLE'], ans: 2 },
      { q: '¿Qué es un índice en una base de datos?', opts: ['Una tabla de respaldo', 'Una estructura que acelera consultas', 'Un tipo de vista', 'Un procedimiento almacenado'], ans: 1 },
      { q: '¿Cuál base de datos es NoSQL?', opts: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], ans: 2 },
      { q: '¿Qué función SQL cuenta el número de registros?', opts: ['SUM()', 'AVG()', 'COUNT()', 'MAX()'], ans: 2 },
      { q: '¿Qué es una llave foránea (FK)?', opts: ['Una clave cifrada', 'Un atributo que referencia la clave primaria de otra tabla', 'Un índice secundario', 'Un constraint único'], ans: 1 },
      { q: '¿Qué sentencia SQL elimina una tabla completa y su estructura?', opts: ['DELETE TABLE', 'REMOVE TABLE', 'TRUNCATE TABLE', 'DROP TABLE'], ans: 3 },
      { q: '¿Qué comando se usa para agregar una columna a una tabla existente?', opts: ['ADD COLUMN', 'UPDATE TABLE', 'ALTER TABLE', 'INSERT COLUMN'], ans: 2 },
      { q: '¿Qué tipo de relación se establece típicamente al usar una tabla intermedia?', opts: ['Uno a Uno (1:1)', 'Uno a Muchos (1:N)', 'Muchos a Muchos (M:N)', 'Dependencia total'], ans: 2 },
      { q: '¿Qué cláusula SQL se utiliza para filtrar registros después de realizar un agrupamiento?', opts: ['WHERE', 'HAVING', 'FILTER', 'LIMIT'], ans: 1 },
      { q: '¿Qué significa SQL?', opts: ['Structured Question Language', 'Structured Query Language', 'Simple Queue Link', 'System Query Logic'], ans: 1 }
    ],
    redes: [
      { q: '¿Cuántas capas tiene el modelo OSI?', opts: ['5', '6', '7', '4'], ans: 2 },
      { q: '¿En qué capa del modelo OSI opera un router?', opts: ['Capa 1', 'Capa 2', 'Capa 3', 'Capa 4'], ans: 2 },
      { q: '¿Qué protocolo asigna IPs dinámicamente?', opts: ['DNS', 'HTTP', 'DHCP', 'FTP'], ans: 2 },
      { q: '¿Cuántos bits tiene una dirección IPv4?', opts: ['64', '32', '128', '16'], ans: 1 },
      { q: '¿Qué protocolo usa el puerto 443 por defecto?', opts: ['HTTP', 'FTP', 'HTTPS', 'SSH'], ans: 2 },
      { q: '¿Qué significa DNS?', opts: ['Data Network System', 'Dynamic Naming Syntax', 'Domain Name System', 'Digital Node Server'], ans: 2 },
      { q: '¿Qué tipo de dirección MAC tiene la forma FF:FF:FF:FF:FF:FF?', opts: ['Multicast', 'Unicast', 'Loopback', 'Broadcast'], ans: 3 },
      { q: '¿Cuál es el rango de una red clase C?', opts: ['0.0.0.0-127.255.255.255', '128.0.0.0-191.255.255.255', '192.0.0.0-223.255.255.255', '224.0.0.0-239.255.255.255'], ans: 2 },
      { q: '¿Qué protocolo de transporte es orientado a conexión?', opts: ['UDP', 'ICMP', 'TCP', 'ARP'], ans: 2 },
      { q: '¿Cuántos bits tiene IPv6?', opts: ['32', '64', '128', '256'], ans: 2 },
      { q: '¿Cuál es la función principal de un switch?', opts: ['Rutear entre redes distintas', 'Filtrar tráfico a nivel de IP', 'Conmutar tramas a nivel de MAC', 'Asignar IPs dinámicamente'], ans: 2 },
      { q: '¿Cuál es el puerto estándar utilizado para el protocolo SSH?', opts: ['21', '22', '23', '80'], ans: 1 },
      { q: '¿Cuál de las siguientes es una dirección IP privada clásica clase A?', opts: ['10.0.0.1', '172.16.0.1', '192.168.1.1', '127.0.0.1'], ans: 0 },
      { q: '¿Qué capa del modelo OSI es responsable de la traducción, cifrado y compresión de datos?', opts: ['Sesión', 'Presentación', 'Aplicación', 'Transporte'], ans: 1 },
      { q: '¿Qué protocolo se utiliza en la web para enviar y recibir correo electrónico entre servidores?', opts: ['SMTP', 'POP3', 'IMAP', 'HTTP'], ans: 0 }
    ],
    anime: [
      { q: '¿En qué año se emitió por primera vez el anime de Dragon Ball Z en Japón?', opts: ['1985', '1986', '1989', '1992'], ans: 2 },
      { q: '¿Quién es el autor del manga "Attack on Titan" (Shingeki no Kyojin)?', opts: ['Masashi Kishimoto', 'Eiichiro Oda', 'Hajime Isayama', 'Akira Toriyama'], ans: 2 },
      { q: '¿Cuántos Nakama tiene la tripulación principal de "One Piece" al inicio?', opts: ['1', '2', '3', '4'], ans: 0 },
      { q: '¿Cómo se llama el sensei que entrena a Naruto antes del examen Chunin?', opts: ['Kakashi', 'Jiraiya', 'Orochimaru', 'Guy'], ans: 1 },
      { q: '¿Qué estudio de animación produjo "Demon Slayer: Kimetsu no Yaiba"?', opts: ['Madhouse', 'Studio Ghibli', 'ufotable', 'Bones'], ans: 2 },
      { q: '¿Cuál es el nombre del poder del protagonista en "My Hero Academia"?', opts: ['Sharingan', 'One For All', 'Nen', 'Haki'], ans: 1 },
      { q: '¿En qué país ficticio se ambienta "Fullmetal Alchemist: Brotherhood"?', opts: ['Japón', 'Amestris', 'Xing', 'Creta'], ans: 1 },
      { q: '¿Quién mató a los padres de Sasuke Uchiha?', opts: ['Orochimaru', 'Madara', 'Itachi', 'Obito'], ans: 2 },
      { q: '¿Qué fruta del diablo consume Monkey D. Luffy?', opts: ['Mera Mera no Mi', 'Gum-Gum Fruit (Gomu Gomu)', 'Hie Hie no Mi', 'Ope Ope no Mi'], ans: 1 },
      { q: '¿Cuántos "Pilares" (Hashira) activos hay al inicio de Demon Slayer?', opts: ['7', '8', '9', '10'], ans: 2 },
      { q: '¿De qué país es originaria la industria del anime?', opts: ['China', 'Corea del Sur', 'Japón', 'EE.UU.'], ans: 2 },
      { q: '¿Cómo se llama el alquimista estatal protagonista de "Fullmetal Alchemist"?', opts: ['Alphonse Elric', 'Edward Elric', 'Roy Mustang', 'Van Hohenheim'], ans: 1 },
      { q: '¿Cuál es el nombre de la tripulación pirata liderada por Luffy?', opts: ['Piratas de Sombrero de Paja', 'Piratas de Roger', 'Piratas de Pelirrojo', 'Piratas de las Cien Bestias'], ans: 0 },
      { q: '¿Qué anime trata sobre un cuaderno de notas que tiene el poder de matar personas?', opts: ['Bleach', 'Death Note', 'Tokyo Ghoul', 'Code Geass'], ans: 1 },
      { q: '¿Qué criatura acompaña a Ash Ketchum en su viaje como pokémon inicial?', opts: ['Charmander', 'Squirtle', 'Pikachu', 'Bulbasaur'], ans: 2 }
    ],
    culturagen: [
      { q: '¿Qué significa la sigla "TIC"?', opts: ['Tecnología de Ingeniería Computacional', 'Tecnologías de la Información y Comunicación', 'Técnicas Informáticas Computacionales', 'Tráfico de Internet Conectado'], ans: 1 },
      { q: '¿Cuánto es 1 Terabyte en Gigabytes?', opts: ['512', '1000', '1024', '2048'], ans: 2 },
      { q: '¿En qué lenguaje de programación escribió Linus Torvalds el kernel de Linux?', opts: ['C++', 'Python', 'C', 'Java'], ans: 2 },
      { q: '¿Qué año se fundó Google?', opts: ['1996', '1997', '1998', '2000'], ans: 2 },
      { q: '¿Qué significa "API"?', opts: ['Application Programming Interface', 'Automated Protocol Interface', 'Advanced Program Integration', 'Application Process Input'], ans: 0 },
      { q: '¿Cuál es el lenguaje de marcado principal de la web?', opts: ['CSS', 'JavaScript', 'HTML', 'XML'], ans: 2 },
      { q: '¿Qué empresa creó Java?', opts: ['Microsoft', 'Apple', 'Sun Microsystems', 'IBM'], ans: 2 },
      { q: '¿Qué significa "IDE"?', opts: ['Integrated Development Environment', 'Internet Data Exchange', 'Interface Design Engine', 'Internal Debug Executor'], ans: 0 },
      { q: '¿Cuál es el sistema operativo más usado en servidores web?', opts: ['Windows Server', 'macOS', 'Linux', 'FreeBSD'], ans: 2 },
      { q: '¿Qué protocolo usa el correo electrónico para enviar mensajes?', opts: ['POP3', 'IMAP', 'SMTP', 'HTTP'], ans: 2 },
      { q: '¿Qué significa "SaaS"?', opts: ['Software as a Service', 'System as a Solution', 'Secure Application Software', 'Serverless App Architecture'], ans: 0 },
      { q: '¿Quién es considerado el padre de la computación teórica y pionero de la IA?', opts: ['Bill Gates', 'Steve Jobs', 'Alan Turing', 'Ada Lovelace'], ans: 2 },
      { q: '¿Cuál es la empresa tecnológica creadora del sistema operativo Windows?', opts: ['Apple', 'IBM', 'Microsoft', 'Oracle'], ans: 2 },
      { q: '¿Qué lenguaje de programación se ejecuta nativamente en los navegadores web tradicionales?', opts: ['Python', 'Ruby', 'Java', 'JavaScript'], ans: 3 },
      { q: '¿Qué significa la sigla "CPU"?', opts: ['Central Processing Unit', 'Computer Personal Unit', 'Common Processor Utility', 'Central Program User'], ans: 0 }
    ],
    metodologias: [
      { q: '¿Cuántos valores tiene el Manifiesto Ágil?', opts: ['4', '8', '12', '6'], ans: 0 },
      { q: '¿Cuál es el marco de trabajo ágil más popular para gestión de proyectos de software?', opts: ['Kanban', 'XP', 'Scrum', 'SAFe'], ans: 2 },
      { q: '¿Qué significa "TDD"?', opts: ['Test Driven Development', 'Task Driven Design', 'Type Defined Data', 'Total Design Deployment'], ans: 0 },
      { q: '¿Cuánto dura típicamente un Sprint en Scrum?', opts: ['1 semana', '2-4 semanas', '1 mes', 'Variable sin límite'], ans: 1 },
      { q: '¿Qué es el "Product Backlog" en Scrum?', opts: ['El registro de errores', 'La lista priorizada de funcionalidades del producto', 'El horario del equipo', 'El informe del Sprint'], ans: 1 },
      { q: '¿Cuál es el rol responsable de maximizar el valor del producto en Scrum?', opts: ['Scrum Master', 'Dev Team', 'Product Owner', 'Stakeholder'], ans: 2 },
      { q: '¿Qué metodología usa tableros con columnas como "Por Hacer", "En Proceso" y "Hecho"?', opts: ['Scrum', 'XP', 'Kanban', 'RUP'], ans: 2 },
      { q: '¿Qué significa CI/CD en DevOps?', opts: ['Code Integration / Code Deploy', 'Continuous Integration / Continuous Delivery', 'Central Interface / Controlled Deployment', 'Cloud Infrastructure / Cloud Delivery'], ans: 1 },
      { q: '¿Cuál es el propósito principal de la retrospectiva en Scrum?', opts: ['Planificar el próximo Sprint', 'Revisar el incremento con el cliente', 'Mejorar el proceso del equipo', 'Estimar el backlog'], ans: 2 },
      { q: '¿Qué es el "Definition of Done" en Scrum?', opts: ['La lista de bugs', 'Criterios que el equipo acordó para considerar una tarea completa', 'La velocidad del equipo', 'El criterio de aceptación del cliente'], ans: 1 },
      { q: '¿Qué modelo describe fases secuenciales como: Requisitos → Diseño → Codificación → Pruebas?', opts: ['Agile', 'Scrum', 'Waterfall', 'Espiral'], ans: 2 },
      { q: '¿Qué artefacto de Scrum describe el trabajo planificado para el Sprint actual?', opts: ['Product Backlog', 'Sprint Backlog', 'Burn down chart', 'Incremento'], ans: 1 },
      { q: '¿Cómo se llama la reunión diaria de coordinación de 15 minutos en Scrum?', opts: ['Sprint Planning', 'Daily Scrum', 'Sprint Review', 'Retrospective'], ans: 1 },
      { q: '¿Qué es un "User Story"?', opts: ['Un informe de errores', 'Una descripción simplificada de una funcionalidad desde la perspectiva del usuario', 'Una especificación técnica formal', 'El currículum del programador'], ans: 1 },
      { q: '¿Qué significa RUP en metodologías tradicionales de software?', opts: ['Rational Unified Process', 'Rapid Utility Protocol', 'Reusable Unit Plan', 'Refactored Unified Program'], ans: 0 }
    ]
  };

  return {
    categorias,
    getPreguntas(catId) {
      const arr = preguntas[catId] ? [...preguntas[catId]] : [];
      // Fisher-Yates shuffle
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    getCatById(id) {
      return categorias.find(c => c.id === id);
    },
    randomCat() {
      return categorias[Math.floor(Math.random() * categorias.length)];
    }
  };
})();
