import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ============================================================
   SPANISH TUTOR — fully offline (dictionary + browser TTS/STT)
   Design language: "passport through language" — ink navy,
   marigold + teal accents, passport-stamp motifs, mono phonetics.
   ============================================================ */

/* ---------------------------- DATA ---------------------------- */

const ALPHABET = [
  { letter: "A", name: "a", example: "Amigo", exampleEn: "Friend" },
  { letter: "B", name: "be", example: "Barco", exampleEn: "Boat" },
  { letter: "C", name: "ce", example: "Casa", exampleEn: "House" },
  { letter: "D", name: "de", example: "Dedo", exampleEn: "Finger" },
  { letter: "E", name: "e", example: "Elefante", exampleEn: "Elephant" },
  { letter: "F", name: "efe", example: "Flor", exampleEn: "Flower" },
  { letter: "G", name: "ge", example: "Gato", exampleEn: "Cat" },
  { letter: "H", name: "hache", example: "Helado", exampleEn: "Ice cream" },
  { letter: "I", name: "i", example: "Isla", exampleEn: "Island" },
  { letter: "J", name: "jota", example: "Jugo", exampleEn: "Juice" },
  { letter: "K", name: "ka", example: "Kilo", exampleEn: "Kilo" },
  { letter: "L", name: "ele", example: "Luna", exampleEn: "Moon" },
  { letter: "M", name: "eme", example: "Mesa", exampleEn: "Table" },
  { letter: "N", name: "ene", example: "Noche", exampleEn: "Night" },
  { letter: "Ñ", name: "eñe", example: "Niño", exampleEn: "Boy/Child" },
  { letter: "O", name: "o", example: "Oso", exampleEn: "Bear" },
  { letter: "P", name: "pe", example: "Perro", exampleEn: "Dog" },
  { letter: "Q", name: "cu", example: "Queso", exampleEn: "Cheese" },
  { letter: "R", name: "erre", example: "Ratón", exampleEn: "Mouse" },
  { letter: "S", name: "ese", example: "Sol", exampleEn: "Sun" },
  { letter: "T", name: "te", example: "Taza", exampleEn: "Cup" },
  { letter: "U", name: "u", example: "Uva", exampleEn: "Grape" },
  { letter: "V", name: "uve", example: "Vaca", exampleEn: "Cow" },
  { letter: "W", name: "uve doble", example: "Wifi", exampleEn: "Wifi" },
  { letter: "X", name: "equis", example: "Xilófono", exampleEn: "Xylophone" },
  { letter: "Y", name: "ye", example: "Yogur", exampleEn: "Yogurt" },
  { letter: "Z", name: "zeta", example: "Zapato", exampleEn: "Shoe" },
];

const BASE_DICTIONARY = [
  { es: "hola", en: "hello", ipa: "/ˈola/", pos: "interj", tags: ["greetings"] },
  { es: "adiós", en: "goodbye", ipa: "/aˈðjos/", pos: "interj", tags: ["greetings"] },
  { es: "buenos días", en: "good morning", ipa: "/ˈbwenos ˈdias/", pos: "phrase", tags: ["greetings"] },
  { es: "buenas tardes", en: "good afternoon", ipa: "/ˈbwenas ˈtaɾðes/", pos: "phrase", tags: ["greetings"] },
  { es: "buenas noches", en: "good evening / good night", ipa: "/ˈbwenas ˈnotʃes/", pos: "phrase", tags: ["greetings"] },
  { es: "cómo estás", en: "how are you (informal)", ipa: "/ˈkomo esˈtas/", pos: "phrase", tags: ["greetings", "questions"] },
  { es: "cómo está usted", en: "how are you (formal)", ipa: "/ˈkomo esˈta ustˈeð/", pos: "phrase", tags: ["greetings", "questions"] },
  { es: "estoy bien", en: "I'm fine", ipa: "/esˈtoi bjen/", pos: "phrase", tags: ["greetings"] },
  { es: "más o menos", en: "so-so", ipa: "/mas o ˈmenos/", pos: "phrase", tags: ["greetings"] },
  { es: "mucho gusto", en: "nice to meet you", ipa: "/ˈmutʃo ˈɡusto/", pos: "phrase", tags: ["greetings"] },
  { es: "encantado", en: "delighted, m.", ipa: "/enkanˈtaðo/", pos: "adj", tags: ["greetings"] },
  { es: "encantada", en: "delighted, f.", ipa: "/enkanˈtaða/", pos: "adj", tags: ["greetings"] },
  { es: "por favor", en: "please", ipa: "/poɾ faˈβoɾ/", pos: "phrase", tags: ["greetings"] },
  { es: "gracias", en: "thank you", ipa: "/ˈɡɾasjas/", pos: "interj", tags: ["greetings"] },
  { es: "muchas gracias", en: "thank you very much", ipa: "/ˈmutʃas ˈɡɾasjas/", pos: "phrase", tags: ["greetings"] },
  { es: "de nada", en: "you're welcome", ipa: "/de ˈnaða/", pos: "phrase", tags: ["greetings"] },
  { es: "nada", en: "nothing", ipa: "/ˈnaða/", pos: "pron", tags: ["phrases", "vocabulary"] },
  { es: "perdón", en: "sorry / excuse me", ipa: "/peɾˈðon/", pos: "interj", tags: ["greetings"] },
  { es: "lo siento", en: "I'm sorry", ipa: "/lo ˈsjento/", pos: "phrase", tags: ["greetings"] },
  { es: "sí", en: "yes", ipa: "/si/", pos: "adv", tags: ["greetings"] },
  { es: "no", en: "no", ipa: "/no/", pos: "adv", tags: ["greetings"] },
  { es: "hasta luego", en: "see you later", ipa: "/ˈasta ˈlweɣo/", pos: "phrase", tags: ["greetings"] },
  { es: "hasta mañana", en: "see you tomorrow", ipa: "/ˈasta maˈɲana/", pos: "phrase", tags: ["greetings"] },
  { es: "bienvenido", en: "welcome, m.", ipa: "/bjembeˈniðo/", pos: "interj", tags: ["greetings"] },
  { es: "qué tal", en: "what's up / how's it going", ipa: "/ke tal/", pos: "phrase", tags: ["greetings", "questions"] },
  { es: "me llamo", en: "my name is", ipa: "/me ˈʝamo/", pos: "phrase", tags: ["greetings"] },
  { es: "cómo te llamas", en: "what's your name (informal)", ipa: "/ˈkomo te ˈʝamas/", pos: "phrase", tags: ["greetings", "questions"] },

  { es: "cero", en: "zero", ipa: "/ˈseɾo/", pos: "num", tags: ["numbers"] },
  { es: "uno", en: "one", ipa: "/ˈuno/", pos: "num", tags: ["numbers"] },
  { es: "dos", en: "two", ipa: "/dos/", pos: "num", tags: ["numbers"] },
  { es: "tres", en: "three", ipa: "/tɾes/", pos: "num", tags: ["numbers"] },
  { es: "cuatro", en: "four", ipa: "/ˈkwatɾo/", pos: "num", tags: ["numbers"] },
  { es: "cinco", en: "five", ipa: "/ˈsinko/", pos: "num", tags: ["numbers"] },
  { es: "seis", en: "six", ipa: "/seis/", pos: "num", tags: ["numbers"] },
  { es: "siete", en: "seven", ipa: "/ˈsjete/", pos: "num", tags: ["numbers"] },
  { es: "ocho", en: "eight", ipa: "/ˈotʃo/", pos: "num", tags: ["numbers"] },
  { es: "nueve", en: "nine", ipa: "/ˈnweβe/", pos: "num", tags: ["numbers"] },
  { es: "diez", en: "ten", ipa: "/djes/", pos: "num", tags: ["numbers"] },
  { es: "once", en: "eleven", ipa: "/ˈonse/", pos: "num", tags: ["numbers"] },
  { es: "doce", en: "twelve", ipa: "/ˈdose/", pos: "num", tags: ["numbers"] },
  { es: "trece", en: "thirteen", ipa: "/tRefe/", pos: "num", tags: ["numbers"] },
  { es: "catorce", en: "fourteen", ipa: "/kaˈtoRse/", pos: "num", tags: ["numbers"] },
  { es: "quince", en: "fifteen", ipa: "/ˈkinse/", pos: "num", tags: ["numbers"] },
  { es: "dieciséis", en: "sixteen", ipa: "/djesiˈseis/", pos: "num", tags: ["numbers"] },
  { es: "diecisiete", en: "seventeen", ipa: "/djesiˈsjete/", pos: "num", tags: ["numbers"] },
  { es: "dieciocho", en: "eighteen", ipa: "/djesiˈotʃo/", pos: "num", tags: ["numbers"] },
  { es: "diecinueve", en: "nineteen", ipa: "/djesiˈnweβe/", pos: "num", tags: ["numbers"] },
  { es: "veinte", en: "twenty", ipa: "/ˈbeinte/", pos: "num", tags: ["numbers"] },
  { es: "treinta", en: "thirty", ipa: "/ˈtReinta/", pos: "num", tags: ["numbers"] },
  { es: "cuarenta", en: "forty", ipa: "/kwaˈRenta/", pos: "num", tags: ["numbers"] },
  { es: "cincuenta", en: "fifty", ipa: "/sinˈkwenta/", pos: "num", tags: ["numbers"] },
  { es: "sesenta", en: "sixty", ipa: "/seˈsenta/", pos: "num", tags: ["numbers"] },
  { es: "setenta", en: "seventy", ipa: "/seˈtenta/", pos: "num", tags: ["numbers"] },
  { es: "ochenta", en: "eighty", ipa: "/oˈtʃenta/", pos: "num", tags: ["numbers"] },
  { es: "noventa", en: "ninety", ipa: "/noˈβenta/", pos: "num", tags: ["numbers"] },
  { es: "cien", en: "one hundred", ipa: "/sjen/", pos: "num", tags: ["numbers"] },

  { es: "comida", en: "food", ipa: "/koˈmiða/", pos: "n", tags: ["food"] },
  { es: "agua", en: "water", ipa: "/ˈaɣwa/", pos: "n", tags: ["food"] },
  { es: "pan", en: "bread", ipa: "/pan/", pos: "n", tags: ["food"] },
  { es: "queso", en: "cheese", ipa: "/ˈkeso/", pos: "n", tags: ["food"] },
  { es: "leche", en: "milk", ipa: "/ˈletʃe/", pos: "n", tags: ["food"] },
  { es: "huevo", en: "egg", ipa: "/ˈweβo/", pos: "n", tags: ["food"] },
  { es: "carne", en: "meat", ipa: "/ˈkaɾne/", pos: "n", tags: ["food"] },
  { es: "pollo", en: "chicken", ipa: "/ˈpoʝo/", pos: "n", tags: ["food"] },
  { es: "pescado", en: "fish", ipa: "/pesˈkaðo/", pos: "n", tags: ["food"] },
  { es: "arroz", en: "rice", ipa: "/aˈrɾos/", pos: "n", tags: ["food"] },
  { es: "fruta", en: "fruit", ipa: "/ˈfɾuta/", pos: "n", tags: ["food"] },
  { es: "verdura", en: "vegetable", ipa: "/beɾˈðuɾa/", pos: "n", tags: ["food"] },
  { es: "manzana", en: "apple", ipa: "/manˈsana/", pos: "n", tags: ["food"] },
  { es: "plátano", en: "banana", ipa: "/ˈplatano/", pos: "n", tags: ["food"] },
  { es: "naranja", en: "orange", ipa: "/naˈɾaŋxa/", pos: "n", tags: ["food", "colors"] },
  { es: "café", en: "coffee", ipa: "/kaˈfe/", pos: "n", tags: ["food"] },
  { es: "té", en: "tea", ipa: "/te/", pos: "n", tags: ["food"] },
  { es: "azúcar", en: "sugar", ipa: "/aˈsukaɾ/", pos: "n", tags: ["food"] },
  { es: "sal", en: "salt", ipa: "/sal/", pos: "n", tags: ["food"] },
  { es: "sopa", en: "soup", ipa: "/ˈsopa/", pos: "n", tags: ["food"] },
  { es: "postre", en: "dessert", ipa: "/ˈpostɾe/", pos: "n", tags: ["food"] },
  { es: "desayuno", en: "breakfast", ipa: "/desaˈʝuno/", pos: "n", tags: ["food"] },
  { es: "almuerzo", en: "lunch", ipa: "/alˈmweɾso/", pos: "n", tags: ["food"] },
  { es: "cena", en: "dinner", ipa: "/ˈsena/", pos: "n", tags: ["food"] },
  { es: "menú", en: "menu", ipa: "/meˈnu/", pos: "n", tags: ["food", "travel"] },
  { es: "cuenta", en: "the bill / check", ipa: "/ˈkwenta/", pos: "n", tags: ["food", "travel"] },
  { es: "vino", en: "wine", ipa: "/ˈbino/", pos: "n", tags: ["food"] },
  { es: "cerveza", en: "beer", ipa: "/seɾˈβesa/", pos: "n", tags: ["food"] },
  { es: "delicioso", en: "delicious", ipa: "/deliˈsjoso/", pos: "adj", tags: ["food", "adjectives"] },
  { es: "sabroso", en: "tasty", ipa: "/saˈβɾoso/", pos: "adj", tags: ["food", "adjectives"] },
  { es: "tengo hambre", en: "I'm hungry", ipa: "/ˈteŋɡo ˈambɾe/", pos: "phrase", tags: ["food"] },
  { es: "tengo sed", en: "I'm thirsty", ipa: "/ˈteŋɡo seð/", pos: "phrase", tags: ["food"] },
  { es: "quisiera", en: "I would like", ipa: "/kiˈsjeɾa/", pos: "phrase", tags: ["food", "travel"] },
  { es: "para llevar", en: "to go / takeaway", ipa: "/ˈpaɾa ʝeˈβaɾ/", pos: "phrase", tags: ["food"] },

  { es: "viaje", en: "trip", ipa: "/ˈbjaxe/", pos: "n", tags: ["travel"] },
  { es: "aeropuerto", en: "airport", ipa: "/aeɾoˈpweɾto/", pos: "n", tags: ["travel"] },
  { es: "avión", en: "airplane", ipa: "/aˈβjon/", pos: "n", tags: ["travel"] },
  { es: "maleta", en: "suitcase", ipa: "/maˈleta/", pos: "n", tags: ["travel"] },
  { es: "pasaporte", en: "passport", ipa: "/pasaˈpoɾte/", pos: "n", tags: ["travel"] },
  { es: "boleto", en: "ticket", ipa: "/boˈleto/", pos: "n", tags: ["travel"] },
  { es: "billete", en: "ticket (Spain)", ipa: "/biˈʎete/", pos: "n", tags: ["travel"] },
  { es: "hotel", en: "hotel", ipa: "/oˈtel/", pos: "n", tags: ["travel"] },
  { es: "habitación", en: "room", ipa: "/aβitaˈsjon/", pos: "n", tags: ["travel", "house"] },
  { es: "reserva", en: "reservation", ipa: "/reˈseɾβa/", pos: "n", tags: ["travel"] },
  { es: "taxi", en: "taxi", ipa: "/ˈtaksi/", pos: "n", tags: ["travel"] },
  { es: "estación", en: "station", ipa: "/estaˈsjon/", pos: "n", tags: ["travel"] },
  { es: "tren", en: "train", ipa: "/tɾen/", pos: "n", tags: ["travel"] },
  { es: "autobús", en: "bus", ipa: "/autoˈβus/", pos: "n", tags: ["travel"] },
  { es: "calle", en: "street", ipa: "/ˈkaʝe/", pos: "n", tags: ["travel"] },
  { es: "mapa", en: "map", ipa: "/ˈmapa/", pos: "n", tags: ["travel"] },
  { es: "izquierda", en: "left", ipa: "/isˈkjeɾða/", pos: "n", tags: ["travel"] },
  { es: "derecha", en: "right", ipa: "/deˈɾetʃa/", pos: "n", tags: ["travel"] },
  { es: "todo recto", en: "straight ahead", ipa: "/ˈtoðo ˈrekto/", pos: "phrase", tags: ["travel"] },
  { es: "dónde está", en: "where is", ipa: "/ˈdonde esˈta/", pos: "phrase", tags: ["travel", "questions"] },
  { es: "equipaje", en: "luggage", ipa: "/ekiˈpaxe/", pos: "n", tags: ["travel"] },
  { es: "vuelo", en: "flight", ipa: "/ˈbwelo/", pos: "n", tags: ["travel"] },
  { es: "aduana", en: "customs", ipa: "/aˈðwana/", pos: "n", tags: ["travel"] },
  { es: "turista", en: "tourist", ipa: "/tuˈɾista/", pos: "n", tags: ["travel", "people"] },
  { es: "extranjero", en: "foreigner / abroad", ipa: "/ekstɾaŋˈxeɾo/", pos: "n", tags: ["travel", "people"] },

  { es: "familia", en: "family", ipa: "/faˈmilja/", pos: "n", tags: ["people"] },
  { es: "madre", en: "mother", ipa: "/ˈmaðɾe/", pos: "n", tags: ["people"] },
  { es: "padre", en: "father", ipa: "/ˈpaðɾe/", pos: "n", tags: ["people"] },
  { es: "hermano", en: "brother", ipa: "/eɾˈmano/", pos: "n", tags: ["people"] },
  { es: "hermana", en: "sister", ipa: "/eɾˈmana/", pos: "n", tags: ["people"] },
  { es: "hijo", en: "son", ipa: "/ˈixo/", pos: "n", tags: ["people"] },
  { es: "hija", en: "daughter", ipa: "/ˈixa/", pos: "n", tags: ["people"] },
  { es: "amigo", en: "friend, m.", ipa: "/aˈmiɣo/", pos: "n", tags: ["people"] },
  { es: "amiga", en: "friend, f.", ipa: "/aˈmiɣa/", pos: "n", tags: ["people"] },
  { es: "novio", en: "boyfriend", ipa: "/ˈnoβjo/", pos: "n", tags: ["people"] },
  { es: "novia", en: "girlfriend", ipa: "/ˈnoβja/", pos: "n", tags: ["people"] },
  { es: "esposo", en: "husband", ipa: "/esˈposo/", pos: "n", tags: ["people"] },
  { es: "esposa", en: "wife", ipa: "/esˈposa/", pos: "n", tags: ["people"] },
  { es: "niño", en: "boy / child", ipa: "/ˈniɲo/", pos: "n", tags: ["people"] },
  { es: "niña", en: "girl", ipa: "/ˈniɲa/", pos: "n", tags: ["people"] },

  /* NEW EXTENDED BODY PARTS SECTIONS */
  { es: "cuerpo", en: "body", ipa: "/ˈkweRpo/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "cabeza", en: "head", ipa: "/kaˈβesa/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "brazo", en: "arm", ipa: "/ˈbɾaso/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "mano", en: "hand", ipa: "/ˈmano/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "pierna", en: "leg", ipa: "/ˈpjeRna/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "pie", en: "foot", ipa: "/pje/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "ojo", en: "eye", ipa: "/ˈoxo/", pos: "n", tags: ["body", "vocabulary"] },
  { es: "boca", en: "mouth", ipa: "/ˈboka/", pos: "n", tags: ["body", "vocabulary"] },

  /* NEW EXTENDED CLOTHING SECTIONS */
  { es: "ropa", en: "clothing", ipa: "/ˈRopa/", pos: "n", tags: ["clothing", "vocabulary"] },
  { es: "camisa", en: "shirt", ipa: "/kaˈmisa/", pos: "n", tags: ["clothing", "vocabulary"] },
  { es: "pantalones", en: "pants", ipa: "/pantaˈlones/", pos: "n", tags: ["clothing", "vocabulary"] },
  { es: "zapatos", en: "shoes", ipa: "/saˈpatos/", pos: "n", tags: ["clothing", "vocabulary"] },
  { es: "chaqueta", en: "jacket", ipa: "/tʃaˈketa/", pos: "n", tags: ["clothing", "vocabulary"] },
  { es: "vestido", en: "dress", ipa: "/besˈtiðo/", pos: "n", tags: ["clothing", "vocabulary"] },

  { es: "ser", en: "to be (permanent)", ipa: "/seɾ/", pos: "v", tags: ["verbs"] },
  { es: "estar", en: "to be (temporary/location)", ipa: "/esˈtaɾ/", pos: "v", tags: ["verbs"] },
  { es: "tener", en: "to have", ipa: "/teˈneɾ/", pos: "v", tags: ["verbs"] },
  { es: "hacer", en: "to do / make", ipa: "/aˈseɾ/", pos: "v", tags: ["verbs"] },
  { es: "ir", en: "to go", ipa: "/iɾ/", pos: "v", tags: ["verbs"] },
  { es: "querer", en: "to want / to love", ipa: "/keˈɾeɾ/", pos: "v", tags: ["verbs"] },
  { es: "poder", en: "to be able to / can", ipa: "/poˈðeɾ/", pos: "v", tags: ["verbs"] },
  { es: "hablar", en: "to speak", ipa: "/aˈβlaɾ/", pos: "v", tags: ["verbs"] },
  { es: "comer", en: "to eat", ipa: "/koˈmeɾ/", pos: "v", tags: ["verbs", "food"] },
  { es: "beber", en: "to drink", ipa: "/beˈβeɾ/", pos: "v", tags: ["verbs", "food"] },
  { es: "vivir", en: "to live", ipa: "/biˈβiɾ/", pos: "v", tags: ["verbs"] },
  { es: "trabajar", en: "to work", ipa: "/tɾaβaˈxaɾ/", pos: "v", tags: ["verbs"] },
  { es: "estudiar", en: "to study", ipa: "/estuˈðjaɾ/", pos: "v", tags: ["verbs"] },
  { es: "entender", en: "to understand", ipa: "/entenˈdeɾ/", pos: "v", tags: ["verbs"] },
  { es: "saber", en: "to know (facts)", ipa: "/saˈβeɾ/", pos: "v", tags: ["verbs"] },
  { es: "conocer", en: "to know (people/places)", ipa: "/konoˈseɾ/", pos: "v", tags: ["verbs"] },
  { es: "necesitar", en: "to need", ipa: "/nesesiˈtaɾ/", pos: "v", tags: ["verbs"] },
  { es: "gustar", en: "to like / to please", ipa: "/ɡusˈtaɾ/", pos: "v", tags: ["verbs"] },
  { es: "llegar", en: "to arrive", ipa: "/ʝeˈɣaɾ/", pos: "v", tags: ["verbs", "travel"] },
  { es: "salir", en: "to leave / go out", ipa: "/saˈliɾ/", pos: "v", tags: ["verbs"] },
  { es: "venir", en: "to come", ipa: "/beˈniɾ/", pos: "v", tags: ["verbs"] },
  { es: "dar", en: "to give", ipa: "/daɾ/", pos: "v", tags: ["verbs"] },
  { es: "ver", en: "to see", ipa: "/beɾ/", pos: "v", tags: ["verbs"] },
  { es: "decir", en: "to say / tell", ipa: "/deˈsiɾ/", pos: "v", tags: ["verbs"] },
  { es: "pensar", en: "to think", ipa: "/penˈsaɾ/", pos: "v", tags: ["verbs"] },

  { es: "hoy", en: "today", ipa: "/oi/", pos: "adv", tags: ["time"] },
  { es: "mañana", en: "tomorrow / morning", ipa: "/maˈɲana/", pos: "n", tags: ["time"] },
  { es: "ayer", en: "yesterday", ipa: "/aˈʝeɾ/", pos: "adv", tags: ["time"] },
  { es: "semana", en: "week", ipa: "/seˈmana/", pos: "n", tags: ["time"] },
  { es: "mes", en: "month", ipa: "/mes/", pos: "n", tags: ["time"] },
  { es: "año", en: "year", ipa: "/ˈaɲo/", pos: "n", tags: ["time"] },
  { es: "hora", en: "hour / time", ipa: "/ˈoɾa/", pos: "n", tags: ["time"] },
  { es: "minuto", en: "minute", ipa: "/miˈnuto/", pos: "n", tags: ["time"] },
  { es: "ahora", en: "now", ipa: "/aˈoɾa/", pos: "adv", tags: ["time"] },
  { es: "después", en: "after / later", ipa: "/despuˈes/", pos: "adv", tags: ["time"] },
  { es: "antes", en: "before", ipa: "/ˈantes/", pos: "adv", tags: ["time"] },
  { es: "temprano", en: "early", ipa: "/tempˈɾano/", pos: "adv", tags: ["time"] },
  { es: "tarde", en: "late / afternoon", ipa: "/ˈtaɾðe/", pos: "adv", tags: ["time"] },
  { es: "noche", en: "night", ipa: "/ˈnotʃe/", pos: "n", tags: ["time"] },
  { es: "lunes", en: "Monday", ipa: "/ˈlunes/", pos: "n", tags: ["time"] },
  { es: "martes", en: "Tuesday", ipa: "/ˈmaɾtes/", pos: "n", tags: ["time"] },
  { es: "miércoles", en: "Wednesday", ipa: "/ˈmjeɾkoles/", pos: "n", tags: ["time"] },
  { es: "jueves", en: "Thursday", ipa: "/ˈxweβes/", pos: "n", tags: ["time"] },
  { es: "viernes", en: "Friday", ipa: "/ˈbjeɾnes/", pos: "n", tags: ["time"] },
  { es: "sábado", en: "Saturday", ipa: "/ˈsaβaðo/", pos: "n", tags: ["time"] },
  { es: "domingo", en: "Sunday", ipa: "/doˈmiŋɡo/", pos: "n", tags: ["time"] },

  { es: "rojo", en: "red", ipa: "/ˈroxo/", pos: "adj", tags: ["colors"] },
  { es: "azul", en: "blue", ipa: "/aˈsul/", pos: "adj", tags: ["colors"] },
  { es: "verde", en: "green", ipa: "/ˈbeɾðe/", pos: "adj", tags: ["colors"] },
  { es: "amarillo", en: "yellow", ipa: "/amaˈɾiʝo/", pos: "adj", tags: ["colors"] },
  { es: "negro", en: "black", ipa: "/ˈneɣɾo/", pos: "adj", tags: ["colors"] },
  { es: "blanco", en: "white", ipa: "/ˈblanko/", pos: "adj", tags: ["colors"] },
  { es: "morado", en: "purple", ipa: "/moˈɾaðo/", pos: "adj", tags: ["colors"] },
  { es: "rosa", en: "pink", ipa: "/ˈrosa/", pos: "adj", tags: ["colors"] },
  { es: "gris", en: "gray", ipa: "/ɡɾis/", pos: "adj", tags: ["colors"] },
  { es: "marrón", en: "brown", ipa: "/maˈron/", pos: "adj", tags: ["colors"] },

  { es: "qué", en: "what", ipa: "/ke/", pos: "pron", tags: ["questions"] },
  { es: "quién", en: "who", ipa: "/kjen/", pos: "pron", tags: ["questions"] },
  { es: "cuándo", en: "when", ipa: "/ˈkwando/", pos: "adv", tags: ["questions"] },
  { es: "dónde", en: "where", ipa: "/ˈdonde/", pos: "adv", tags: ["questions"] },
  { es: "por qué", en: "why", ipa: "/poɾ ke/", pos: "adv", tags: ["questions"] },
  { es: "cómo", en: "how", ipa: "/ˈkomo/", pos: "adv", tags: ["questions"] },
  { es: "cuánto", en: "how much", ipa: "/ˈkwanto/", pos: "adv", tags: ["questions"] },
  { es: "cuál", en: "which", ipa: "/kwal/", pos: "pron", tags: ["questions"] },

  { es: "bueno", en: "good", ipa: "/ˈbweno/", pos: "adj", tags: ["adjectives"] },
  { es: "malo", en: "bad", ipa: "/ˈmalo/", pos: "adj", tags: ["adjectives"] },
  { es: "grande", en: "big", ipa: "/ˈɡɾande/", pos: "adj", tags: ["adjectives"] },
  { es: "pequeño", en: "small", ipa: "/peˈkeɲo/", pos: "adj", tags: ["adjectives"] },
  { es: "bonito", en: "pretty", ipa: "/boˈnito/", pos: "adj", tags: ["adjectives"] },
  { es: "feo", en: "ugly", ipa: "/ˈfeo/", pos: "adj", tags: ["adjectives"] },
  { es: "feliz", en: "happy", ipa: "/feˈlis/", pos: "adj", tags: ["adjectives"] },
  { es: "triste", en: "sad", ipa: "/ˈtɾiste/", pos: "adj", tags: ["adjectives"] },
  { es: "cansado", en: "tired", ipa: "/kanˈsaðo/", pos: "adj", tags: ["adjectives"] },
  { es: "ocupado", en: "busy", ipa: "/okuˈpaðo/", pos: "adj", tags: ["adjectives"] },
  { es: "fácil", en: "easy", ipa: "/ˈfasil/", pos: "adj", tags: ["adjectives"] },
  { es: "difícil", en: "difficult", ipa: "/diˈfisil/", pos: "adj", tags: ["adjectives"] },
  { es: "rápido", en: "fast", ipa: "/ˈrapiðo/", pos: "adj", tags: ["adjectives"] },
  { es: "lento", en: "slow", ipa: "/ˈlento/", pos: "adj", tags: ["adjectives"] },
  { es: "nuevo", en: "new", ipa: "/ˈnweβo/", pos: "adj", tags: ["adjectives"] },
  { es: "viejo", en: "old", ipa: "/ˈbjexo/", pos: "adj", tags: ["adjectives"] },
  { es: "caro", en: "expensive", ipa: "/ˈkaɾo/", pos: "adj", tags: ["adjectives"] },
  { es: "barato", en: "cheap", ipa: "/barato/", pos: "adj", tags: ["adjectives"] },

  { es: "casa", en: "house", ipa: "/ˈkasa/", pos: "n", tags: ["house"] },
  { es: "puerta", en: "door", ipa: "/ˈpweɾta/", pos: "n", tags: ["house"] },
  { es: "ventana", en: "window", ipa: "/benˈtana/", pos: "n", tags: ["house"] },
  { es: "mesa", en: "table", ipa: "/ˈmesa/", pos: "n", tags: ["house"] },
  { es: "silla", en: "chair", ipa: "/ˈsiʝa/", pos: "n", tags: ["house"] },
  { es: "cama", en: "bed", ipa: "/ˈkama/", pos: "n", tags: ["house"] },
  { es: "cocina", en: "kitchen", ipa: "/koˈsina/", pos: "n", tags: ["house"] },
  { es: "baño", en: "bathroom", ipa: "/ˈbaɲo/", pos: "n", tags: ["house"] },

  { es: "clima", en: "climate / weather", ipa: "/ˈklima/", pos: "n", tags: ["weather"] },
  { es: "sol", en: "sun", ipa: "/sol/", pos: "n", tags: ["weather"] },
  { es: "lluvia", en: "rain", ipa: "/ˈʎuβja/", pos: "n", tags: ["weather"] },
  { es: "nieve", en: "snow", ipa: "/ˈnjeβe/", pos: "n", tags: ["weather"] },
  { es: "viento", en: "wind", ipa: "/ˈbjento/", pos: "n", tags: ["weather"] },
  { es: "calor", en: "heat", ipa: "/kaˈloɾ/", pos: "n", tags: ["weather"] },
  { es: "frío", en: "cold", ipa: "/ˈfɾio/", pos: "n", tags: ["weather"] },

  { es: "no entiendo", en: "I don't understand", ipa: "/no enˈtjendo/", pos: "phrase", tags: ["phrases"] },
  { es: "puedes repetir", en: "can you repeat that", ipa: "/ˈpweðes repeˈtiɾ/", pos: "phrase", tags: ["phrases", "questions"] },
  { es: "más despacio", en: "slower / more slowly", ipa: "/mas desˈpasjo/", pos: "phrase", tags: ["phrases"] },
  { es: "cuánto cuesta", en: "how much does it cost", ipa: "/ˈkwanto ˈkwesta/", pos: "phrase", tags: ["phrases", "questions"] },
  { es: "está bien", en: "it's fine / okay", ipa: "/esˈta bjen/", pos: "phrase", tags: ["phrases"] },
  { es: "claro", en: "of course", ipa: "/ˈklaɾo/", pos: "interj", tags: ["phrases"] },
  { es: "tal vez", en: "maybe", ipa: "/tal bes/", pos: "adv", tags: ["phrases"] },
  { es: "siempre", en: "always", ipa: "/ˈsjempɾe/", pos: "adv", tags: ["phrases"] },
  { es: "nunca", en: "never", ipa: "/ˈnunka/", pos: "adv", tags: ["phrases"] },
  { es: "también", en: "also / too", ipa: "/tamˈbjen/", pos: "adv", tags: ["phrases"] },
  { es: "aquí", en: "here", ipa: "/aˈki/", pos: "adv", tags: ["phrases"] },
  { es: "allí", en: "there", ipa: "/aˈʎi/", pos: "adv", tags: ["phrases"] },
  { es: "mucho", en: "a lot / much", ipa: "/ˈmutʃo/", pos: "adv", tags: ["phrases"] },
  { es: "poco", en: "a little / few", ipa: "/ˈpoko/", pos: "adv", tags: ["phrases"] },
  { es: "y", en: "and", ipa: "/i/", pos: "conj", tags: ["phrases"] },
  { es: "o", en: "or", ipa: "/o/", pos: "conj", tags: ["phrases"] },
  { es: "pero", en: "but", ipa: "/ˈpeɾo/", pos: "conj", tags: ["phrases"] },
  { es: "porque", en: "because", ipa: "/ˈpoɾke/", pos: "conj", tags: ["phrases"] },
  { es: "con", en: "with", ipa: "/kon/", pos: "prep", tags: ["phrases"] },
  { es: "sin", en: "without", ipa: "/sin/", pos: "prep", tags: ["phrases"] },
  { es: "para", en: "for / in order to", ipa: "/ˈpaɾa/", pos: "prep", tags: ["phrases"] },
  { es: "yo", en: "I", ipa: "/ʝo/", pos: "pron", tags: ["phrases"] },
  { es: "tú", en: "you (informal)", ipa: "/tu/", pos: "pron", tags: ["phrases"] },
  { es: "usted", en: "you (formal)", ipa: "/usˈteð/", pos: "pron", tags: ["phrases"] },
  { es: "él", en: "he", ipa: "/el/", pos: "pron", tags: ["phrases"] },
  { es: "ella", en: "she", ipa: "/ˈeʝa/", pos: "pron", tags: ["phrases"] },
  { es: "nosotros", en: "we", ipa: "/noˈsotɾos/", pos: "pron", tags: ["phrases"] },
];

function buildExtraNumbers() {
  const ones = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const teensSpecial = { 21: "veintiuno", 22: "veintidós", 23: "veintitrés", 24: "veinticuatro", 25: "veinticinco", 26: "veintiséis", 27: "veintisiete", 28: "veintiocho", 29: "veintinueve" };
  const tensWords = { 30: "treinta", 40: "cuarenta", 50: "cincuenta", 60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa" };
  const out = [];
  for (let n = 21; n <= 29; n++) out.push({ es: teensSpecial[n], en: String(n), ipa: "", pos: "num", tags: ["numbers"] });
  for (const base of [30, 40, 50, 60, 70, 80, 90]) {
    for (let n = base + 1; n <= base + 9; n++) {
      out.push({ es: `${tensWords[base]} y ${ones[n - base]}`, en: String(n), ipa: "", pos: "num", tags: ["numbers"] });
    }
  }
  return out;
}
const DICTIONARY = [...BASE_DICTIONARY, ...buildExtraNumbers()];

function deckFrom(tag) {
  return DICTIONARY.filter((w) => w.tags.includes(tag));
}
const PRESET_DECKS = [
  { id: "deck_greetings", name: "Greetings", icon: "👋", cards: deckFrom("greetings") },
  { id: "deck_food", name: "Food", icon: "🍽️", cards: deckFrom("food") },
  { id: "deck_travel", name: "Travel", icon: "✈️", cards: deckFrom("travel") },
  { id: "deck_body", name: "Body Parts", icon: "💪", cards: deckFrom("body") },
  { id: "deck_clothing", name: "Clothing", icon: "👕", cards: deckFrom("clothing") },
  { id: "deck_numbers", name: "Numbers 1–100", icon: "🔢", cards: DICTIONARY.filter((w) => w.tags.includes("numbers")) },
];

const SCENARIOS = {
  casual: {
    label: "Talking casually", icon: "💬", start: "n1",
    nodes: {
      n1: { es: "¡Hola! ¿Qué tal?", en: "Hi! How's it going?", next: "n2" },
      n2: { es: "Me alegro. ¿Qué haces hoy?", en: "Glad to hear. What are you doing today?", next: "n3" },
      n3: { es: "¡Qué bien! ¿Te gusta estudiar español?", en: "Nice! Do you like studying Spanish?", next: "n4" },
      n4: { es: "Perfecto, sigue practicando. ¡Hasta luego!", en: "Perfect, keep practicing. See you later!", next: null },
    },
  },
  date: {
    label: "On a date", icon: "🌹", start: "n1",
    nodes: {
      n1: { es: "Hola, ¡qué bonito lugar! ¿Vienes aquí a menudo?", en: "Hi, what a nice place! Do you come here often?", next: "n2" },
      n2: { es: "Me gusta mucho tu sonrisa. ¿Qué te gusta hacer en tu tiempo libre?", en: "I really like your smile. What do you like to do in your free time?", next: "n3" },
      n3: { es: "Suena divertido. ¿Quieres pedir algo de tomar?", en: "Sounds fun. Do you want to order something to drink?", next: "n4" },
      n4: { es: "Perfecto. Lo estoy pasando muy bien contigo.", en: "Perfect. I'm having a great time with you.", next: null },
    },
  },
  restaurant: {
    label: "At a restaurant", icon: "🍽️", start: "n1",
    nodes: {
      n1: { es: "Buenas noches, bienvenido. ¿Mesa para cuántos?", en: "Good evening, welcome. A table for how many?", next: "n2" },
      n2: { es: "Muy bien, por aquí. Aquí tiene el menú. ¿Qué le gustaría beber?", en: "Great, right this way. Here's the menu. What would you like to drink?", next: "n3" },
      n3: { es: "Excelente elección. ¿Ya sabe qué va a pedir de comer?", en: "Excellent choice. Do you know what you'll have to eat?", next: "n4" },
      n4: { es: "Perfecto, ahora se lo traigo. ¡Buen provecho!", en: "Perfect, I'll bring that right out. Enjoy your meal!", next: null },
    },
  },
  airport: {
    label: "Meet someone at the airport", icon: "🛬", start: "n1",
    nodes: {
      n1: { es: "¡Hola! ¡Qué alegría verte! ¿Cómo fue el vuelo?", en: "Hi! So happy to see you! How was the flight?", next: "n2" },
      n2: { es: "¿Tienes toda tu equipaje?", en: "Do you have all your luggage?", next: "n3" },
      n3: { es: "Perfecto, el taxi nos espera afuera. ¿Tienes hambre?", en: "Perfect, the taxi is waiting outside. Are you hungry?", next: "n4" },
      n4: { es: "Genial, vamos a comer algo antes de ir al hotel.", en: "Great, let's eat something before heading to the hotel.", next: null },
    },
  },
};

const COMMON_MISTAKES = [
  { pattern: /\byo soy\s+\d+\s+años\b/i, fix: "yo tengo ___ años", note: "Use 'tener' (to have) for age in Spanish, not 'ser'. Literally: 'I have 20 years.'" },
  { pattern: /\bmuy mucho\b/i, fix: "muchísimo / mucho", note: "Don't stack 'muy' with 'mucho' — pick one intensifier." },
  { pattern: /\bmuy bueno\b.*\bno\b/i, fix: "no es muy bueno", note: "Negation 'no' goes before the verb in Spanish, not at the end." },
  { pattern: /\btengo\s+entender\b/i, fix: "entiendo", note: "Use the conjugated verb 'entiendo' (I understand), not 'tengo' + infinitive." },
  { pattern: /\bhabla ingles\b/i, fix: "¿hablas inglés?", note: "Missing question marks, and 'inglés' needs an accent." },
];

const FILLER_LINES = [
  { es: "Interesante, cuéntame más.", en: "Interesting, tell me more." },
  { es: "Entiendo. ¿Y qué más?", en: "I understand. And what else?" },
  { es: "¡Qué bien! Sigamos practicando.", en: "Nice! Let's keep practicing." },
  { es: "Vale, continuemos.", en: "Okay, let's continue." },
];

/* ------------------------- STORAGE HELPERS ------------------------- */
const STORAGE_KEY = "es_tutor_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("none");
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastVisit: null, learned: {}, customDecks: [] };
  }
}
function saveProgress(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/* ------------------------- SPEECH ENGINE FIXES ------------------------- */
function speak(text, lang = "es-ES") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.88; 

  // Force load available native system speech options
  let voices = window.speechSynthesis.getVoices();
  
  const setTargetVoice = () => {
    // Priority 1: Pick localized direct match variations (Mónica, Jorge, etc.)
    let match = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.includes("es-"));
    if (!match) {
      // Priority 2: Standard global Latin America/Spain fallback engines
      match = voices.find(v => v.lang.startsWith("es"));
    }
    if (match) {
      u.voice = match;
      u.lang = match.lang;
    } else {
      u.lang = "es-ES"; // Generic browser flag standard
    }
  };

  if (!voices || voices.length === 0) {
    // Handle Chrome/Android asynchronous speech engine voice listing delays
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      setTargetVoice();
      window.speechSynthesis.speak(u);
    };
  } else {
    setTargetVoice();
    window.speechSynthesis.speak(u);
  }
}

function getRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = "es-ES";
  r.interimResults = false;
  r.maxAlternatives = 1;
  return r;
}

/* ------------------------- TEXT / LOOKUP HELPERS ------------------------- */
function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,]/g, "").trim();
}
function findEntryEs(word) {
  const n = normalize(word);
  return DICTIONARY.find((d) => normalize(d.es) === n) ||
    DICTIONARY.find((d) => normalize(d.es).split(" ").includes(n));
}
function searchEs(query) {
  const n = normalize(query);
  if (!n) return [];
  return DICTIONARY.filter((d) => normalize(d.es).includes(n)).slice(0, 12);
}
function searchEn(query) {
  const n = normalize(query);
  if (!n) return [];
  return DICTIONARY.filter((d) => normalize(d.en).includes(n)).slice(0, 12);
}

function grammarNote(entry) {
  if (!entry) return "Not in the offline dictionary yet.";
  switch (entry.pos) {
    case "v": return "Verb — infinitive form, conjugate based on subject.";
    case "n": return "Noun — watch its gender (el/la) when pairing with adjectives.";
    case "adj": return "Adjective — must agree in gender & number with the noun.";
    case "adv": return "Adverb — usually doesn't change form.";
    case "pron": return "Pronoun.";
    case "prep": return "Preposition.";
    case "conj": return "Conjunction — connects clauses.";
    case "num": return "Number.";
    case "interj": return "Interjection / exclamation.";
    case "phrase": return "Fixed phrase — best learned as a whole chunk.";
    default: return "";
  }
}

/* ============================= MAIN APP COMPONENT ============================= */
export default function SpanishTutorApp() {
  const [tab, setTab] = useState("chat");
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    setProgress((p) => {
      const today = todayStr();
      if (p.lastVisit === today) return p;
      let streak = p.streak || 0;
      if (p.lastVisit) {
        const gap = daysBetween(p.lastVisit, today);
        streak = gap === 1 ? streak + 1 : gap === 0 ? streak : 1;
      } else {
        streak = 1;
      }
      const next = { ...p, streak, lastVisit: today };
      saveProgress(next);
      return next;
    });
  }, []);

  useEffect(() => saveProgress(progress), [progress]);

  const markLearned = useCallback((es) => {
    setProgress((p) => ({ ...p, learned: { ...p.learned, [normalize(es)]: true } }));
  }, []);
  const unmarkLearned = useCallback((es) => {
    setProgress((p) => {
      const learned = { ...p.learned };
      delete learned[normalize(es)];
      return { ...p, learned };
    });
  }, []);
  const addCustomDeck = useCallback((deck) => {
    setProgress((p) => ({ ...p, customDecks: [...(p.customDecks || []), deck] }));
  }, []);
  const deleteCustomDeck = useCallback((id) => {
    setProgress((p) => ({ ...p, customDecks: (p.customDecks || []).filter((d) => d.id !== id) }));
  }, []);

  const wordsLearnedCount = Object.keys(progress.learned || {}).length;

  return (
    <div className="app-root">
      <GlobalStyle />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ES</span>
          <div className="brand-text">
            <div className="brand-title">Cuaderno</div>
            <div className="brand-sub">your Spanish passport</div>
          </div>
        </div>
        <div className="stats">
          <div className="stamp">
            <div className="stamp-num">{progress.streak || 0}</div>
            <div className="stamp-label">day streak</div>
          </div>
          <div className="stamp teal">
            <div className="stamp-num">{wordsLearnedCount}</div>
            <div className="stamp-label">words learned</div>
          </div>
        </div>
      </header>

      <nav className="tabs">
        {[
          { id: "chat", label: "Chat", icon: "💬" },
          { id: "alphabet", label: "Alphabet", icon: "🔤" },
          { id: "vocab", label: "Vocab", icon: "🗂️" },
          { id: "translate", label: "Translate", icon: "🌐" },
        ].map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === "chat" && <ChatTab />}
        {tab === "alphabet" && <AlphabetTab />}
        {tab === "vocab" && (
          <VocabTab
            progress={progress}
            markLearned={markLearned}
            unmarkLearned={unmarkLearned}
            addCustomDeck={addCustomDeck}
            deleteCustomDeck={deleteCustomDeck}
          />
        )}
        {tab === "translate" && <TranslateTab />}
      </main>
    </div>
  );
}

/* ----------------------------- CHAT TAB ----------------------------- */
function ChatTab() {
  const [scenarioKey, setScenarioKey] = useState("casual");
  const [messages, setMessages] = useState(() => seedScenario("casual"));
  const [nodeKey, setNodeKey] = useState("n1");
  const [input, setInput] = useState("");
  const [correction, setCorrection] = useState(null);
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const logEndRef = useRef(null);

  function seedScenario(key) {
    const sc = SCENARIOS[key];
    const first = sc.nodes[sc.start];
    return [{ from: "tutor", es: first.es, en: first.en }];
  }

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function switchScenario(key) {
    setScenarioKey(key);
    setMessages(seedScenario(key));
    setNodeKey(SCENARIOS[key].start);
    setCorrection(null);
  }

  function checkMistakes(text) {
    for (const m of COMMON_MISTAKES) {
      if (m.pattern.test(text)) return m;
    }
    return null;
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", es: text }]);

    const mistake = checkMistakes(text);
    setCorrection(mistake ? mistake : null);

    const sc = SCENARIOS[scenarioKey];
    const current = sc.nodes[nodeKey];
    const nextKey = current?.next;

    setTimeout(() => {
      if (nextKey && sc.nodes[nextKey]) {
        const nextNode = sc.nodes[nextKey];
        setMessages((m) => [...m, { from: "tutor", es: nextNode.es, en: nextNode.en }]);
        setNodeKey(nextKey);
        speak(nextNode.es);
      } else {
        const filler = FILLER_LINES[Math.floor(Math.random() * FILLER_LINES.length)];
        setMessages((m) => [...m, { from: "tutor", es: filler.es, en: filler.en }]);
        speak(filler.es);
      }
    }, 450);

    setInput("");
  }

  function toggleMic() {
    const r = recogRef.current || getRecognition();
    if (!r) {
      alert("Speech recognition isn't supported in this browser. You can type instead — everything else still works.");
      return;
    }
    recogRef.current = r;
    if (listening) {
      r.stop();
      setListening(false);
      return;
    }
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    setListening(true);
    r.start();
  }

  return (
    <div className="chat-tab">
      <div className="scenario-row">
        {Object.entries(SCENARIOS).map(([key, sc]) => (
          <button key={key} className={`scenario-chip ${scenarioKey === key ? "active" : ""}`} onClick={() => switchScenario(key)}>
            <span>{sc.icon}</span> {sc.label}
          </button>
        ))}
      </div>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.from === "tutor" && (
              <button className="speak-btn" onClick={() => speak(m.es)} aria-label="Play pronunciation">🔊</button>
            )}
            <div className="bubble-es">{m.es}</div>
            {m.en && <div className="bubble-en">{m.en}</div>}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {correction && (
        <div className="correction-box">
          <div className="correction-title">Quick correction</div>
          <div className="correction-fix">Try: <strong>{correction.fix}</strong></div>
          <div className="correction-note">{correction.note}</div>
        </div>
      )}

      <div className="chat-input-row">
        <button className={`mic-btn ${listening ? "live" : ""}`} onClick={toggleMic} title="Speak in Spanish">
          {listening ? "● listening" : "🎙️"}
        </button>
        <input
          className="chat-input"
          placeholder="Escribe en español..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        />
        <button className="send-btn" onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
}

/* --------------------------- ALPHABET TAB WITH IMMERSIVE MODAL --------------------------- */
function AlphabetTab() {
  const [active, setActive] = useState(null);

  const selectedData = useMemo(() => {
    if (!active) return null;
    return ALPHABET.find((x) => x.letter === active);
  }, [active]);

  const handleTileClick = (letter, example) => {
    setActive(letter);
    speak(example, "es-ES");
  };

  return (
    <div className="alphabet-tab">
      <div className="alphabet-grid">
        {ALPHABET.map((l) => (
          <button
            key={l.letter}
            className={`letter-tile ${active === l.letter ? "active" : ""}`}
            onClick={() => handleTileClick(l.letter, l.example)}
          >
            {l.letter}
          </button>
        ))}
      </div>

      {selectedData && (
        <div className="modal-backdrop" onClick={() => setActive(null)}>
          <div className="modal-interface" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActive(null)}>✕</button>
            <div className="letter-big">{selectedData.letter}</div>
            <div className="letter-name">Pronounced: "{selectedData.name}"</div>
            <div className="letter-example">
              <span className="es">{selectedData.example}</span> 
              <span className="en"> — {selectedData.exampleEn}</span>
            </div>
            <button className="ctrl-btn speak wide" onClick={() => speak(selectedData.example)}>
              🔊 Play Pronunciation
            </button>
          </div>
        </div>
      )}
      {!active && <p className="hint">Tap a letter to reveal its full cinematic phonetic breakdown.</p>}
    </div>
  );
}

/* ----------------------------- VOCAB DECK TAB ----------------------------- */
function VocabTab({ progress, markLearned, unmarkLearned, addCustomDeck, deleteCustomDeck }) {
  const [openDeck, setOpenDeck] = useState(null);
  const [creating, setCreating] = useState(false);

  const allDecks = useMemo(() => {
    return [...PRESET_DECKS, ...(progress.customDecks || [])];
  }, [progress.customDecks]);

  return (
    <div className="vocab-tab">
      {!openDeck && !creating && (
        <div className="deck-grid">
          {allDecks.map((d) => {
            const learnedCount = d.cards.filter((c) => progress.learned[normalize(c.es)]).length;
            return (
              <div key={d.id} className="deck-card" onClick={() => setOpenDeck(d.id)}>
                <div className="deck-icon">{d.icon || "📘"}</div>
                <div className="deck-name">{d.name}</div>
                <div className="deck-meta">{learnedCount}/{d.cards.length} learned</div>
                {d.custom && (
                  <button
                    className="deck-delete"
                    onClick={(e) => { e.stopPropagation(); deleteCustomDeck(d.id); }}
                  >✕</button>
                )}
              </div>
            );
          })}
          <div className="deck-card new-deck" onClick={() => setCreating(true)}>
            <div className="deck-icon">➕</div>
            <div className="deck-name">Create Deck</div>
            <div className="deck-meta">Add custom vocabulary</div>
          </div>
        </div>
      )}

      {openDeck && !creating && (
        <DeckView
          deck={allDecks.find((d) => d.id === openDeck)}
          progress={progress}
          markLearned={markLearned}
          unmarkLearned={unmarkLearned}
          onBack={() => setOpenDeck(null)}
        />
      )}

      {creating && (
        <DeckCreator
          onCancel={() => setCreating(false)}
          onSave={(deck) => { addCustomDeck(deck); setCreating(false); }}
        />
      )}
    </div>
  );
}

function DeckView({ deck, progress, markLearned, unmarkLearned, onBack }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  if (!deck || !deck.cards || deck.cards.length === 0) return null;
  
  const card = deck.cards[idx];
  const isLearned = !!progress.learned[normalize(card.es)];

  function go(delta) {
    setFlipped(false);
    setIdx((i) => (i + delta + deck.cards.length) % deck.cards.length);
  }

  return (
    <div className="deck-view">
      <button className="back-btn" onClick={onBack}>← All decks</button>
      <div className="deck-title">{deck.icon} {deck.name} <span className="deck-progress">{idx + 1}/{deck.cards.length}</span></div>

      <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
        <div className="flashcard-inner">
          <div className="flashcard-face front">
            <div className="fc-word">{card.es}</div>
            {card.ipa && <div className="fc-ipa">{card.ipa}</div>}
          </div>
          <div className="flashcard-face back">
            <div className="fc-word">{card.en}</div>
            <div className="fc-hint">tap to flip back</div>
          </div>
        </div>
      </div>

      <div className="flash-controls">
        <button className="ctrl-btn" onClick={() => go(-1)}>◀</button>
        <button className="ctrl-btn speak" onClick={(e) => { e.stopPropagation(); speak(card.es); }}>🔊</button>
        <button
          className={`ctrl-btn learn ${isLearned ? "learned" : ""}`}
          onClick={() => (isLearned ? unmarkLearned(card.es) : markLearned(card.es))}
        >
          {isLearned ? "✓ Learned" : "Mark learned"}
        </button>
        <button className="ctrl-btn" onClick={() => go(1)}>▶</button>
      </div>
    </div>
  );
}

function DeckCreator({ onCancel, onSave }) {
  const [name, setName] = useState("");
  const [cards, setCards] = useState(Array.from({ length: 5 }, () => ({ es: "", en: "" })));

  function updateCard(i, field, value) {
    setCards((cs) => cs.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }
  function addCard() {
    if (cards.length >= 100) return;
    setCards((cs) => [...cs, { es: "", en: "" }]);
  }
  function removeCard(i) {
    if (cards.length <= 2) return;
    setCards((cs) => cs.filter((_, idx) => idx !== i));
  }
  function save() {
    const filled = cards.filter((c) => c.es.trim() && c.en.trim());
    if (!name.trim()) return alert("Give your deck a name.");
    if (filled.length < 2) return alert(`You need at least 2 complete flashcards (you have ${filled.length}).`);
    onSave({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      icon: "⭐",
      custom: true,
      cards: filled.map((c) => ({ es: c.es.trim(), en: c.en.trim(), ipa: "" })),
    });
  }

  const filledCount = cards.filter((c) => c.es.trim() && c.en.trim()).length;

  return (
    <div className="deck-creator">
      <button className="back-btn" onClick={onCancel}>← Cancel</button>
      <div className="creator-title">New flashcard deck</div>
      <input className="deck-name-input" placeholder="Deck name (e.g. Action verbs)" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="creator-progress">{filledCount} cards filled out</div>

      <div className="card-rows">
        {cards.map((c, i) => (
          <div key={i} className="card-row">
            <span className="card-row-num">{i + 1}</span>
            <input placeholder="Spanish" value={c.es} onChange={(e) => updateCard(i, "es", e.target.value)} />
            <input placeholder="English" value={c.en} onChange={(e) => updateCard(i, "en", e.target.value)} />
            {cards.length > 2 && <button className="row-remove" onClick={() => removeCard(i)}>✕</button>}
          </div>
        ))}
      </div>

      <div className="creator-actions">
        {cards.length < 100 && <button className="ctrl-btn" onClick={addCard}>+ Add card</button>}
        <button className="send-btn" onClick={save}>Save Deck</button>
      </div>
    </div>
  );
}

/* --------------------------- TRANSLATE TAB --------------------------- */
function TranslateTab() {
  const [sub, setSub] = useState("en");
  return (
    <div className="translate-tab">
      <div className="sub-tabs">
        <button className={sub === "en" ? "active" : ""} onClick={() => setSub("en")}>English → Spanish</button>
        <button className={sub === "es" ? "active" : ""} onClick={() => setSub("es")}>Spanish → English</button>
        <button className={sub === "broken" ? "active" : ""} onClick={() => setSub("broken")}>Broken Spanish helper</button>
      </div>
      {sub === "en" && <SimpleTranslate direction="en" />}
      {sub === "es" && <SimpleTranslate direction="es" />}
      {sub === "broken" && <BrokenSpanishHelper />}
    </div>
  );
}

function SimpleTranslate({ direction }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return direction === "en" ? searchEn(query) : searchEs(query);
  }, [query, direction]);

  return (
    <div className="simple-translate">
      <input
        className="translate-input"
        placeholder={direction === "en" ? "Type an English word..." : "Escribe una palabra en español..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="translate-results">
        {results.length === 0 && query.trim() && (
          <div className="no-result">Not in the offline dictionary yet.</div>
        )}
        {results.map((r, i) => (
          <div key={i} className="result-card">
            <div className="result-main">
              <span className="result-es" onClick={() => speak(r.es)}>{r.es} 🔊</span>
              <span className="result-arrow">→</span>
              <span className="result-en">{r.en}</span>
            </div>
            {r.ipa && <div className="result-ipa">{r.ipa}</div>}
            <div className="result-note">{grammarNote(r)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrokenSpanishHelper() {
  const [text, setText] = useState("");
  const words = useMemo(
    () => text.split(/\s+/).map((w) => w.trim()).filter(Boolean),
    [text]
  );

  return (
    <div className="broken-helper">
      <textarea
        className="translate-textarea"
        placeholder="Escribe una frase en español..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      {words.length > 0 && (
        <>
          <button className="ctrl-btn speak wide" onClick={() => speak(text)}>🔊 Hear full sentence</button>
          <div className="word-breakdown">
            {words.map((w, i) => {
              const entry = findEntryEs(w);
              return (
                <div key={i} className="word-chip-wrap">
                  <button className="word-chip" onClick={() => speak(w)}>{w}</button>
                  <div className="word-gloss">
                    <div className="gloss-en">{entry ? entry.en : "?"}</div>
                    {entry?.ipa && <div className="gloss-ipa">{entry.ipa}</div>}
                    <div className="gloss-note">{grammarNote(entry)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------- STYLES ---------------------------- */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --ink: #10151f;
        --ink-2: #171e2b;
        --paper: #ece7dd;
        --paper-dim: #b9c0cc;
        --marigold: #e8a93b;
        --teal: #2f9c95;
        --rose: #c9647a;
        --line: rgba(236,231,221,0.12);
      }
      * { box-sizing: border-box; }
      .app-root {
        font-family: 'Inter', sans-serif;
        background: radial-gradient(ellipse at top, #161d2a 0%, var(--ink) 55%);
        color: var(--paper);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        max-width: 480px;
        margin: 0 auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        position: relative;
      }
      .topbar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 20px 14px; border-bottom: 1px solid var(--line);
      }
      .brand { display: flex; align-items: center; gap: 10px; }
      .brand-mark {
        font-family: 'Fraunces', serif; font-weight: 600; font-size: 15px;
        border: 1.5px solid var(--marigold); color: var(--marigold);
        width: 34px; height: 34px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transform: rotate(-8deg);
      }
      .brand-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; line-height: 1.1; }
      .brand-sub { font-size: 11px; color: var(--paper-dim); letter-spacing: 0.04em; }
      .stats { display: flex; gap: 8px; }
      .stamp {
        border: 1.5px dashed var(--marigold); border-radius: 10px;
        padding: 4px 10px; text-align: center; transform: rotate(-3deg);
        min-width: 56px;
      }
      .stamp.teal { border-color: var(--teal); transform: rotate(3deg); }
      .stamp-num { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
      .stamp-label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--paper-dim); }

      .tabs { display: flex; border-bottom: 1px solid var(--line); }
      .tab-btn {
        flex: 1; background: none; border: none; color: var(--paper-dim);
        padding: 12px 4px; font-size: 12.5px; font-weight: 500; cursor: pointer;
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        border-bottom: 2px solid transparent; transition: all 0.15s;
      }
      .tab-icon { font-size: 16px; }
      .tab-btn.active { color: var(--marigold); border-bottom-color: var(--marigold); }

      .content { flex: 1; padding: 18px 18px 26px; overflow-y: auto; }

      /* CHAT STYLES */
      .scenario-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
      .scenario-chip {
        background: var(--ink-2); border: 1px solid var(--line); color: var(--paper-dim);
        padding: 7px 11px; border-radius: 20px; font-size: 12px; cursor: pointer;
      }
      .scenario-chip.active { border-color: var(--marigold); color: var(--marigold); }
      .chat-log {
        background: var(--ink-2); border-radius: 14px; padding: 14px;
        max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
        border: 1px solid var(--line);
      }
      .bubble { max-width: 85%; padding: 9px 12px; border-radius: 12px; position: relative; }
      .bubble.tutor { background: rgba(47,156,149,0.15); align-self: flex-start; border: 1px solid rgba(47,156,149,0.3); }
      .bubble.user { background: rgba(232,169,59,0.15); align-self: flex-end; border: 1px solid rgba(232,169,59,0.3); }
      .bubble-es { font-size: 14.5px; }
      .bubble-en { font-size: 11.5px; color: var(--paper-dim); margin-top: 2px; }
      .speak-btn { position: absolute; top: -10px; left: -10px; background: var(--teal); border: none; border-radius: 50%; width: 22px; height: 22px; font-size: 10px; cursor: pointer; }
      .correction-box { margin-top: 12px; background: rgba(201,100,122,0.12); border: 1px solid rgba(201,100,122,0.4); border-radius: 10px; padding: 10px 12px; }
      .correction-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--rose); margin-bottom: 4px; }
      .correction-fix { font-size: 13.5px; margin-bottom: 3px; }
      .correction-note { font-size: 11.5px; color: var(--paper-dim); }
      .chat-input-row { display: flex; gap: 8px; margin-top: 12px; }
      .mic-btn { background: var(--ink-2); border: 1px solid var(--line); border-radius: 10px; padding: 0 12px; cursor: pointer; color: var(--paper); font-size: 13px; }
      .mic-btn.live { background: var(--rose); color: white; }
      .chat-input { flex: 1; background: var(--ink-2); border: 1px solid var(--line); border-radius: 10px; padding: 12px; color: var(--paper); font-size: 13.5px; }
      .send-btn { background: var(--marigold); border: none; border-radius: 10px; padding: 0 16px; font-weight: 600; cursor: pointer; color: var(--ink); }

      /* ALPHABET GRID & NEW EXPERIMENTAL COMPACT MODAL SETUP */
      .alphabet-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
      .letter-tile { aspect-ratio: 1; background: var(--ink-2); border: 1px solid var(--line); border-radius: 10px; color: var(--paper); font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; cursor: pointer; transition: 0.15s ease-out; }
      .letter-tile:hover { border-color: var(--marigold); transform: scale(1.03); }
      .letter-tile.active { border-color: var(--marigold); color: var(--marigold); background: rgba(232,169,59,0.1); }
      
      /* NEW IMMERSIVE GLASSBACK DIALOG INTERFACE OVERLAY */
      .modal-backdrop {
        position: absolute; inset: 0; background: rgba(16, 21, 31, 0.82);
        backdrop-filter: blur(5px); display: flex; align-items: center;
        justify-content: center; padding: 20px; z-index: 999;
      }
      .modal-interface {
        background: #1c2434; border: 2px solid var(--marigold); border-radius: 20px;
        padding: 30px 24px; width: 100%; max-width: 360px; text-align: center;
        box-shadow: 0 16px 40px rgba(0,0,0,0.6); position: relative;
      }
      .modal-close {
        position: absolute; top: 12px; right: 14px; background: none; border: none;
        color: var(--paper-dim); font-size: 18px; cursor: pointer;
      }
      .letter-big { font-family: 'Fraunces', serif; font-size: 64px; color: var(--marigold); margin-bottom: 2px; }
      .letter-name { color: var(--paper-dim); font-family: 'IBM Plex Mono', monospace; font-size: 14px; margin-bottom: 12px; }
      .letter-example { font-size: 18px; margin-bottom: 22px; }
      .letter-example .es { color: var(--teal); font-weight: 600; }
      .letter-example .en { color: var(--paper-dim); }

      /* DECK AND VOCABULARY ENGINE CORES */
      .deck-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .deck-card { background: var(--ink-2); border: 1px solid var(--line); border-radius: 14px; padding: 16px; cursor: pointer; position: relative; }
      .deck-card.new-deck { border-style: dashed; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
      .deck-icon { font-size: 22px; margin-bottom: 6px; }
      .deck-name { font-weight: 600; font-size: 14px; }
      .deck-meta { font-size: 11px; color: var(--paper-dim); margin-top: 3px; }
      .deck-delete { position: absolute; top: 8px; right: 8px; background: none; border: none; color: var(--rose); cursor: pointer; font-size: 12px; }
      .back-btn { background: none; border: none; color: var(--teal); cursor: pointer; font-size: 13px; margin-bottom: 12px; padding: 0; }
      .deck-title { font-family: 'Fraunces', serif; font-size: 17px; margin-bottom: 14px; display: flex; justify-content: space-between; }
      .deck-progress { font-family: 'Inter'; font-size: 12px; color: var(--paper-dim); }
      
      .flashcard { perspective: 1000px; height: 170px; cursor: pointer; }
      .flashcard-inner { position: relative; width: 100%; height: 100%; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
      .flashcard.flipped .flashcard-inner { transform: rotateY(180deg); }
      .flashcard-face { position: absolute; inset: 0; backface-visibility: hidden; background: var(--ink-2); border: 1px solid var(--marigold); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
      .flashcard-face.back { transform: rotateY(180deg); border-color: var(--teal); }
      .fc-word { font-family: 'Fraunces', serif; font-size: 24px; text-align: center; padding: 0 16px; }
      .fc-ipa { font-family: 'IBM Plex Mono', monospace; color: var(--paper-dim); font-size: 12px; }
      .fc-hint { font-size: 10px; color: var(--paper-dim); }
      .flash-controls { display: flex; gap: 8px; margin-top: 14px; justify-content: center; }
      
      .ctrl-btn { background: var(--ink-2); border: 1px solid var(--line); color: var(--paper); border-radius: 10px; padding: 8px 14px; cursor: pointer; font-size: 13px; }
      .ctrl-btn.learn.learned { background: var(--teal); color: var(--ink); border-color: var(--teal); font-weight: 600; }
      .ctrl-btn.wide { width: 100%; margin-bottom: 14px; background: var(--ink-2); border: 1px solid var(--line); color: var(--paper); display: block; border-radius: 10px; padding: 10px; font-weight: 500; }
      .deck-name-input, .translate-input, .translate-textarea { width: 100%; background: var(--ink-2); border: 1px solid var(--line); border-radius: 10px; padding: 12px; color: var(--paper); font-size: 13.5px; margin-bottom: 8px; font-family: 'Inter'; }
      .creator-title { font-family: 'Fraunces', serif; font-size: 17px; margin-bottom: 10px; }
      .creator-progress { font-size: 11px; color: var(--paper-dim); margin-bottom: 10px; }
      .card-rows { display: flex; flex-direction: column; gap: 6px; max-height: 240px; overflow-y: auto; margin-bottom: 12px; }
      .card-row { display: flex; gap: 6px; align-items: center; }
      .card-row-num { font-size: 10px; color: var(--paper-dim); width: 16px; }
      .card-row input { flex: 1; background: var(--ink-2); border: 1px solid var(--line); border-radius: 8px; padding: 8px; color: var(--paper); font-size: 12.5px; min-width: 0; }
      .row-remove { background: none; border: none; color: var(--rose); cursor: pointer; }
      .creator-actions { display: flex; justify-content: space-between; margin-top: 14px; }
      .hint { color: var(--paper-dim); font-size: 13px; text-align: center; margin-top: 30px; }

      /* TRANSLATE SYSTEMS */
      .sub-tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
      .sub-tabs button { background: var(--ink-2); border: 1px solid var(--line); color: var(--paper-dim); padding: 7px 10px; border-radius: 10px; font-size: 11.5px; cursor: pointer; }
      .sub-tabs button.active { color: var(--marigold); border-color: var(--marigold); }
      .translate-results { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
      .result-card { background: var(--ink-2); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; }
      .result-main { display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .result-es { color: var(--teal); cursor: pointer; font-weight: 600; }
      .result-arrow { color: var(--paper-dim); }
      .result-ipa { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--paper-dim); margin-top: 2px; }
      .result-note { font-size: 11px; color: var(--paper-dim); margin-top: 4px; }
      .no-result { font-size: 12.5px; color: var(--paper-dim); }
      .word-breakdown { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .word-chip-wrap { display: flex; flex-direction: column; align-items: center; }
      .word-chip { background: var(--ink-2); border: 1px solid var(--marigold); color: var(--marigold); border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 13px; }
      .word-gloss { text-align: center; margin-top: 4px; max-width: 100px; }
      .gloss-en { font-size: 11px; }
      .gloss-ipa { font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; color: var(--paper-dim); }
      .gloss-note { font-size: 8.5px; color: var(--paper-dim); margin-top: 1px; }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }
    `}</style>
  );
}
