export const TIMETABLE_DATA = {
  "institute": "Bhagwan Parshuram Institute of Technology, Delhi",
  "academic_year": "2025-2026",
  "semester_type": "Even",
  "groups": ["G1", "G2"],

  "time_slots": [
    { "slot": 1, "time": "09:30-10:20" },
    { "slot": 2, "time": "10:20-11:10" },
    { "slot": 3, "time": "11:10-12:00" },
    { "slot": 4, "time": "12:00-12:50" },
    { "slot": 5, "time": "12:50-13:40" },
    { "slot": 6, "time": "13:40-14:30" },
    { "slot": 7, "time": "14:30-15:20" },
    { "slot": 8, "time": "15:20-16:10" },
    { "slot": 9, "time": "16:10-17:00" }
  ],

  "sections": [

    /* ===================== 2nd SEM (First Year) ===================== */

    {
      "section": "CSE-A",
      "semester": 2,
      "room": "103",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"ES"},
          {"slot":2,"type":"THEORY","subject":"LIB"},
          {"slot":3,"type":"THEORY","subject":"AM"},
          {"slot":4,"type":"THEORY","subject":"AC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"EM"},
          {"slot":7,"type":"THEORY","subject":"AC"},
          {"slot":8,"type":"LAB","G1":"WP Lab","G2":"AP Lab"},
          {"slot":9,"type":"LAB","G1":"WP Lab","G2":"AP Lab"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"EM"},
          {"slot":2,"type":"THEORY","subject":"AM"},
          {"slot":3,"type":"LAB","G1":"AP Lab","G2":"ES Lab"},
          {"slot":4,"type":"LAB","G1":"AP Lab","G2":"ES Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AP"},
          {"slot":7,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"LAB","G1":"AC Lab","G2":"WP Lab"},
          {"slot":2,"type":"LAB","G1":"AC Lab","G2":"WP Lab"},
          {"slot":3,"type":"THEORY","subject":"AC"},
          {"slot":4,"type":"THEORY","subject":"AP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"CS"},
          {"slot":7,"type":"THEORY","subject":"ES"},
          {"slot":8,"type":"LAB","G1":"ES Lab","G2":"LIB"},
          {"slot":9,"type":"LAB","G1":"ES Lab","G2":"LIB"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"LIB"},
          {"slot":2,"type":"THEORY","subject":"CS"},
          {"slot":3,"type":"LAB","G1":"EG Lab","G2":"AC Lab"},
          {"slot":4,"type":"LAB","G1":"EG Lab","G2":"AC Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"ES"},
          {"slot":7,"type":"THEORY","subject":"AM"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"CS"},
          {"slot":2,"type":"THEORY","subject":"AM"},
          {"slot":3,"type":"THEORY","subject":"EM"},
          {"slot":4,"type":"THEORY","subject":"AP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PDP"},
          {"slot":7,"type":"THEORY","subject":"LIB"},
          {"slot":8,"type":"LAB","G1":"LIB","G2":"EG Lab"},
          {"slot":9,"type":"LAB","G1":"LIB","G2":"EG Lab"}
        ]
      }
    },

    {
      "section": "CSE-B",
      "semester": 2,
      "room": "104",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"AM"},
          {"slot":2,"type":"THEORY","subject":"AC"},
          {"slot":3,"type":"THEORY","subject":"ES"},
          {"slot":4,"type":"THEORY","subject":"AP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"WP Lab","G2":"AP Lab"},
          {"slot":7,"type":"LAB","G1":"WP Lab","G2":"AP Lab"},
          {"slot":8,"type":"LAB","G1":"ES Lab","G2":"LIB"},
          {"slot":9,"type":"LAB","G1":"ES Lab","G2":"LIB"}
        ],
        "Tuesday": [
          {"slot":1,"type":"LAB","G1":"AC Lab","G2":"LIB"},
          {"slot":2,"type":"LAB","G1":"AC Lab","G2":"LIB"},
          {"slot":3,"type":"THEORY","subject":"EM"},
          {"slot":4,"type":"THEORY","subject":"AC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AC"},
          {"slot":7,"type":"THEORY","subject":"CS"},
          {"slot":8,"type":"LAB","G1":"EG Lab","G2":"WP Lab"},
          {"slot":9,"type":"LAB","G1":"EG Lab","G2":"WP Lab"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"ES"},
          {"slot":2,"type":"THEORY","subject":"AM"},
          {"slot":3,"type":"THEORY","subject":"CS"},
          {"slot":4,"type":"THEORY","subject":"AP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"EG Lab","G2":"AC Lab"},
          {"slot":7,"type":"LAB","G1":"EG Lab","G2":"AC Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"AP"},
          {"slot":2,"type":"THEORY","subject":"EM"},
          {"slot":3,"type":"THEORY","subject":"CS"},
          {"slot":4,"type":"THEORY","subject":"ES"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AM"},
          {"slot":7,"type":"THEORY","subject":"PDP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"LAB","G1":"LIB","G2":"WP Lab"},
          {"slot":2,"type":"LAB","G1":"LIB","G2":"WP Lab"},
          {"slot":3,"type":"LAB","G1":"EG Lab","G2":"ES Lab"},
          {"slot":4,"type":"LAB","G1":"EG Lab","G2":"ES Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"EM"},
          {"slot":7,"type":"THEORY","subject":"AM"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "CSE-C",
      "semester": 2,
      "room": "112",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"LAB","G1":"WP Lab","G2":"EG Lab"},
          {"slot":2,"type":"LAB","G1":"WP Lab","G2":"EG Lab"},
          {"slot":3,"type":"THEORY","subject":"AC"},
          {"slot":4,"type":"THEORY","subject":"AC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AM"},
          {"slot":7,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"AP"},
          {"slot":2,"type":"THEORY","subject":"CS"},
          {"slot":3,"type":"LAB","G1":"EG Lab","G2":"AC Lab"},
          {"slot":4,"type":"LAB","G1":"EG Lab","G2":"AC Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AM"},
          {"slot":7,"type":"THEORY","subject":"EM"},
          {"slot":8,"type":"LAB","G1":"ES Lab","G2":"ES Lab"},
          {"slot":9,"type":"LAB","G1":"ES Lab","G2":"ES Lab"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"CS"},
          {"slot":2,"type":"THEORY","subject":"AP"},
          {"slot":3,"type":"THEORY","subject":"AC"},
          {"slot":4,"type":"THEORY","subject":"ES"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AM"},
          {"slot":7,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"AM"},
          {"slot":2,"type":"THEORY","subject":"ES"},
          {"slot":3,"type":"THEORY","subject":"EM"},
          {"slot":4,"type":"THEORY","subject":"AP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"AC Lab","G2":"AP Lab"},
          {"slot":7,"type":"LAB","G1":"AC Lab","G2":"AP Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"EM"},
          {"slot":2,"type":"THEORY","subject":"ES"},
          {"slot":3,"type":"THEORY","subject":"PDP"},
          {"slot":4,"type":"THEORY","subject":"CS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"ES Lab","G2":"WP Lab"},
          {"slot":7,"type":"LAB","G1":"ES Lab","G2":"WP Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "EEE",
      "semester": 2,
      "room": "TBA",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"EM"},
          {"slot":2,"type":"THEORY","subject":"ES"},
          {"slot":3,"type":"LAB","G1":"WP Lab","G2":"EG Lab"},
          {"slot":4,"type":"LAB","G1":"WP Lab","G2":"EG Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AM"},
          {"slot":7,"type":"THEORY","subject":"AC"},
          {"slot":8,"type":"LAB","G1":"AC Lab","G2":"ES Lab"},
          {"slot":9,"type":"LAB","G1":"AC Lab","G2":"ES Lab"}
        ],
        "Tuesday": [
          {"slot":1,"type":"LAB","G1":"LIB","G2":"AP Lab"},
          {"slot":2,"type":"LAB","G1":"LIB","G2":"AP Lab"},
          {"slot":3,"type":"THEORY","subject":"AC"},
          {"slot":4,"type":"THEORY","subject":"EM"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AP"},
          {"slot":7,"type":"THEORY","subject":"ES"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"AP"},
          {"slot":2,"type":"THEORY","subject":"EM"},
          {"slot":3,"type":"THEORY","subject":"AC"},
          {"slot":4,"type":"THEORY","subject":"ES"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"CS"},
          {"slot":7,"type":"THEORY","subject":"AM"},
          {"slot":8,"type":"LAB","G1":"AP Lab","G2":"AC Lab"},
          {"slot":9,"type":"LAB","G1":"AP Lab","G2":"AC Lab"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"LIB"},
          {"slot":2,"type":"THEORY","subject":"AP"},
          {"slot":3,"type":"THEORY","subject":"AM"},
          {"slot":4,"type":"THEORY","subject":"CS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"EG Lab","G2":"WP Lab"},
          {"slot":7,"type":"LAB","G1":"EG Lab","G2":"WP Lab"},
          {"slot":8,"type":"LAB","G1":"ES Lab","G2":"AC Lab"},
          {"slot":9,"type":"LAB","G1":"ES Lab","G2":"AC Lab"}
        ],
        "Friday": [
          {"slot":1,"type":"LAB","G1":"AC Lab","G2":"ES Lab"},
          {"slot":2,"type":"LAB","G1":"AC Lab","G2":"ES Lab"},
          {"slot":3,"type":"THEORY","subject":"AM"},
          {"slot":4,"type":"THEORY","subject":"CS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PDP"},
          {"slot":7,"type":"THEORY","subject":"LIB"},
          {"slot":8,"type":"LAB","G1":"ES Lab","G2":"EG Lab"},
          {"slot":9,"type":"LAB","G1":"ES Lab","G2":"EG Lab"}
        ]
      }
    },

    /* ===================== 4th SEM ===================== */

    {
      "section": "CSE-A",
      "semester": 4,
      "room": "402",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"LAB","G1":"C&S Lab","G2":"DBMS Lab"},
          {"slot":2,"type":"LAB","G1":"C&S Lab","G2":"DBMS Lab"},
          {"slot":3,"type":"THEORY","subject":"C&S"},
          {"slot":4,"type":"THEORY","subject":"Prob & LP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"JAVA"},
          {"slot":7,"type":"THEORY","subject":"TOC"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"JAVA"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"LAB","G1":"Prob & LP Lab","G2":"C&S Lab"},
          {"slot":4,"type":"LAB","G1":"Prob & LP Lab","G2":"C&S Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"C&S"},
          {"slot":7,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"Prob & LP"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"THEORY","subject":"JAVA"},
          {"slot":4,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"C&S"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"TOC"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"LAB","G1":"DBMS Lab","G2":"JAVA Lab"},
          {"slot":4,"type":"LAB","G1":"DBMS Lab","G2":"JAVA Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"Prob & LP"},
          {"slot":7,"type":"THEORY","subject":"C&S"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"DBMS"},
          {"slot":2,"type":"THEORY","subject":"Prob & LP"},
          {"slot":3,"type":"LAB","G1":"JAVA Lab","G2":"Prob & LP Lab"},
          {"slot":4,"type":"LAB","G1":"JAVA Lab","G2":"Prob & LP Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "CSE-B",
      "semester": 4,
      "room": "403",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"Prob & LP"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"LAB","G1":"JAVA Lab","G2":"DBMS Lab"},
          {"slot":4,"type":"LAB","G1":"JAVA Lab","G2":"DBMS Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"C&S"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"C&S"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"THEORY","subject":"TOC"},
          {"slot":4,"type":"THEORY","subject":"JAVA"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":7,"type":"THEORY","subject":"Prob & LP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"TOC"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"LAB","G1":"DBMS Lab","G2":"Prob&LP Lab"},
          {"slot":4,"type":"LAB","G1":"DBMS Lab","G2":"Prob&LP Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"C&S"},
          {"slot":7,"type":"THEORY","subject":"Prob & LP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"LAB","G1":"Prob&LP Lab","G2":"C&S Lab"},
          {"slot":2,"type":"LAB","G1":"Prob&LP Lab","G2":"C&S Lab"},
          {"slot":3,"type":"THEORY","subject":"DBMS"},
          {"slot":4,"type":"THEORY","subject":"Prob & LP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"JAVA"},
          {"slot":2,"type":"THEORY","subject":"TOC"},
          {"slot":3,"type":"LAB","G1":"C&S Lab","G2":"JAVA Lab"},
          {"slot":4,"type":"LAB","G1":"C&S Lab","G2":"JAVA Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":7,"type":"THEORY","subject":"C&S"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "CSE-C",
      "semester": 4,
      "room": "404",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"LAB","G1":"DBMS Lab","G2":"JAVA Lab"},
          {"slot":2,"type":"LAB","G1":"DBMS Lab","G2":"JAVA Lab"},
          {"slot":3,"type":"THEORY","subject":"C&S"},
          {"slot":4,"type":"THEORY","subject":"Prob & LP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"DBMS"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"LAB","G1":"JAVA Lab","G2":"DBMS Lab"},
          {"slot":2,"type":"LAB","G1":"JAVA Lab","G2":"DBMS Lab"},
          {"slot":3,"type":"THEORY","subject":"Prob & LP"},
          {"slot":4,"type":"THEORY","subject":"C&S"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"DBMS"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"DBMS"},
          {"slot":2,"type":"THEORY","subject":"C&S"},
          {"slot":3,"type":"LAB","G1":"C&S Lab","G2":"Prob & LP Lab"},
          {"slot":4,"type":"LAB","G1":"C&S Lab","G2":"Prob & LP Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"JAVA"},
          {"slot":2,"type":"THEORY","subject":"TOC"},
          {"slot":3,"type":"LAB","G1":"Prob & LP Lab","G2":"C&S Lab"},
          {"slot":4,"type":"LAB","G1":"Prob & LP Lab","G2":"C&S Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":7,"type":"THEORY","subject":"Prob & LP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"C&S"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"THEORY","subject":"TOC"},
          {"slot":4,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"Prob & LP"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "CSE-DS",
      "semester": 4,
      "room": "204",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"C&S"},
          {"slot":2,"type":"THEORY","subject":"TOC"},
          {"slot":3,"type":"LAB","G1":"C&S Lab","G2":"Prob & LP Lab"},
          {"slot":4,"type":"LAB","G1":"C&S Lab","G2":"Prob & LP Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"JAVA"},
          {"slot":7,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"Prob & LP"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"THEORY","subject":"C&S"},
          {"slot":4,"type":"THEORY","subject":"JAVA"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"Tech. Writing"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"LAB","G1":"DBMS Lab","G2":"JAVA Lab"},
          {"slot":2,"type":"LAB","G1":"DBMS Lab","G2":"JAVA Lab"},
          {"slot":3,"type":"THEORY","subject":"Prob & LP"},
          {"slot":4,"type":"THEORY","subject":"JAVA"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"DBMS"},
          {"slot":7,"type":"THEORY","subject":"C&S"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"DBMS"},
          {"slot":2,"type":"THEORY","subject":"JAVA"},
          {"slot":3,"type":"THEORY","subject":"TOC"},
          {"slot":4,"type":"THEORY","subject":"Prob & LP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"Prob & LP Lab","G2":"C&S Lab"},
          {"slot":7,"type":"LAB","G1":"Prob & LP Lab","G2":"C&S Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"TOC"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"LAB","G1":"JAVA Lab","G2":"DBMS Lab"},
          {"slot":4,"type":"LAB","G1":"JAVA Lab","G2":"DBMS Lab"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"C&S"},
          {"slot":7,"type":"THEORY","subject":"Prob & LP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "EEE",
      "semester": 4,
      "room": "NB 302",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"PSLP"},
          {"slot":2,"type":"THEORY","subject":"ELEC-II"},
          {"slot":3,"type":"THEORY","subject":"PS-I"},
          {"slot":4,"type":"THEORY","subject":"NAS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PSLP Lab (211)","G2":"PS-I Lab (211)"},
          {"slot":7,"type":"LAB","G1":"PSLP Lab (211)","G2":"PS-I Lab (211)"},
          {"slot":8,"type":"THEORY","subject":"EM-II"},
          {"slot":9,"type":"THEORY","subject":"MMM (6B)"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"PS-I"},
          {"slot":2,"type":"THEORY","subject":"EM-II"},
          {"slot":3,"type":"THEORY","subject":"NAS"},
          {"slot":4,"type":"THEORY","subject":"ELEC-II"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PS-I Lab (9A)","G2":"PSLP Lab (211)"},
          {"slot":7,"type":"LAB","G1":"PS-I Lab (9A)","G2":"PSLP Lab (211)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"NAS"},
          {"slot":2,"type":"THEORY","subject":"PS-I"},
          {"slot":3,"type":"LAB","G1":"NAS Lab (203)","G2":"ELEC-II Lab (07)"},
          {"slot":4,"type":"LAB","G1":"NAS Lab (203)","G2":"ELEC-II Lab (07)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PSLP"},
          {"slot":7,"type":"THEORY","subject":"TW"},
          {"slot":8,"type":"LAB","G2":"EM-II Lab (9A)"},
          {"slot":9,"type":"LAB","G2":"EM-II Lab (9A)"}
        ],
        "Thursday": [
          {"slot":1,"type":"LAB","G1":"ELEC-II Lab (07)","G2":"NAS Lab (203)"},
          {"slot":2,"type":"LAB","G1":"ELEC-II Lab (07)","G2":"NAS Lab (203)"},
          {"slot":3,"type":"THEORY","subject":"PSLP"},
          {"slot":4,"type":"THEORY","subject":"EM-II"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"ELEC-II"},
          {"slot":7,"type":"THEORY","subject":"PS-I"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"ELEC-II"},
          {"slot":2,"type":"THEORY","subject":"TW"},
          {"slot":3,"type":"THEORY","subject":"EM-II"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"EM-II Lab (9A)"},
          {"slot":7,"type":"LAB","G1":"EM-II Lab (9A)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    /* ===================== 6th SEM ===================== */

    {
      "section": "CSE-A",
      "semester": 6,
      "room": "407",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"STATS"},
          {"slot":2,"type":"THEORY","subject":"WT"},
          {"slot":3,"type":"THEORY","subject":"AI/ML"},
          {"slot":4,"type":"THEORY","subject":"AI/ML"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PIP"},
          {"slot":7,"type":"LAB","G1":"WT Lab","G2":"WT Lab"},
          {"slot":8,"type":"LAB","G1":"WT Lab","G2":"WT Lab"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"PIP"},
          {"slot":2,"type":"THEORY","subject":"STATS"},
          {"slot":3,"type":"THEORY","subject":"WT"},
          {"slot":4,"type":"THEORY","subject":"AI/ML"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"WT Lab","G2":"PIP Lab"},
          {"slot":7,"type":"LAB","G1":"WT Lab","G2":"PIP Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"SPM"},
          {"slot":2,"type":"THEORY","subject":"WT"},
          {"slot":3,"type":"THEORY","subject":"PIP"},
          {"slot":4,"type":"THEORY","subject":"STATS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AI/ML"},
          {"slot":7,"type":"THEORY","subject":"SPM"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "CSE-B",
      "semester": 6,
      "room": "406",
      "schedule": {
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"SPM"},
          {"slot":2,"type":"THEORY","subject":"WT"},
          {"slot":3,"type":"THEORY","subject":"AI/ML"},
          {"slot":4,"type":"THEORY","subject":"STATS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PIP Lab","G2":"WT Lab"},
          {"slot":7,"type":"LAB","G1":"PIP Lab","G2":"WT Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "CSE-C",
      "semester": 6,
      "room": "408",
      "schedule": {
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"WT"},
          {"slot":2,"type":"THEORY","subject":"AI/ML"},
          {"slot":3,"type":"THEORY","subject":"PIP"},
          {"slot":4,"type":"THEORY","subject":"STATS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"WT Lab","G2":"PIP Lab"},
          {"slot":7,"type":"LAB","G1":"WT Lab","G2":"PIP Lab"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    /* ===================== IT 4th SEM ===================== */

    {
      "section": "IT-A",
      "semester": 4,
      "room": "301",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"C&S"},
          {"slot":2,"type":"THEORY","subject":"C&S"},
          {"slot":3,"type":"THEORY","subject":"TOC"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TW"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"THEORY","subject":"MMM"},
          {"slot":9,"type":"THEORY","subject":"PDP"}
        ],
        "Tuesday": [
          {"slot":1,"type":"LAB","G1":"PSLP Lab (102-A)","G2":"CS Lab (208)"},
          {"slot":2,"type":"LAB","G1":"PSLP Lab (102-A)","G2":"CS Lab (208)"},
          {"slot":3,"type":"THEORY","subject":"TOC"},
          {"slot":4,"type":"THEORY","subject":"DBMS (220)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"C&S"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"TOC"},
          {"slot":2,"type":"THEORY","subject":"JAVA"},
          {"slot":3,"type":"THEORY","subject":"PSLP"},
          {"slot":4,"type":"THEORY","subject":"DBMS (220)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"CS Lab (208)","G2":"PSLP Lab (102-A)"},
          {"slot":7,"type":"LAB","G1":"CS Lab (208)","G2":"PSLP Lab (102-A)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"C&S"},
          {"slot":2,"type":"THEORY","subject":"JAVA"},
          {"slot":3,"type":"THEORY","subject":"PSLP"},
          {"slot":4,"type":"THEORY","subject":"DBMS (220)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"DBMS Lab (102-A)","G2":"JAVA Lab (102-B)"},
          {"slot":7,"type":"LAB","G1":"DBMS Lab (102-A)","G2":"JAVA Lab (102-B)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"LAB","G1":"DBMS Lab (102-A)","G2":"JAVA Lab (102-B)"},
          {"slot":2,"type":"LAB","G1":"DBMS Lab (102-A)","G2":"JAVA Lab (102-B)"},
          {"slot":3,"type":"THEORY","subject":"TW"},
          {"slot":4,"type":"THEORY","subject":"DBMS (220)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"PSLP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "IT-B",
      "semester": 4,
      "room": "302",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"LAB","G1":"DBMS Lab (313-B)","G2":"JAVA Lab (102-C)"},
          {"slot":2,"type":"LAB","G1":"DBMS Lab (313-B)","G2":"JAVA Lab (102-C)"},
          {"slot":3,"type":"THEORY","subject":"DBMS"},
          {"slot":4,"type":"THEORY","subject":"JAVA"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"C&S"},
          {"slot":7,"type":"THEORY","subject":"PSLP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"TOC"},
          {"slot":2,"type":"THEORY","subject":"JAVA"},
          {"slot":3,"type":"THEORY","subject":"TW"},
          {"slot":4,"type":"THEORY","subject":"C&S"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PSLP"},
          {"slot":7,"type":"THEORY","subject":"DBMS"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"LAB","G1":"PSLP Lab (102-B)","G2":"CS Lab (208)"},
          {"slot":2,"type":"LAB","G1":"PSLP Lab (102-B)","G2":"CS Lab (208)"},
          {"slot":3,"type":"THEORY","subject":"PSLP"},
          {"slot":4,"type":"THEORY","subject":"DBMS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"JAVA"},
          {"slot":7,"type":"THEORY","subject":"TOC"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"TOC"},
          {"slot":2,"type":"THEORY","subject":"C&S"},
          {"slot":3,"type":"THEORY","subject":"DBMS"},
          {"slot":4,"type":"THEORY","subject":"TW"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"JAVA Lab (102-C)","G2":"DBMS Lab (313-B)"},
          {"slot":7,"type":"LAB","G1":"JAVA Lab (102-C)","G2":"DBMS Lab (313-B)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"PSLP"},
          {"slot":2,"type":"THEORY","subject":"TOC"},
          {"slot":3,"type":"THEORY","subject":"C&S"},
          {"slot":4,"type":"THEORY","subject":"JAVA"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PSLP Lab (102-B)","G2":"CS Lab (208)"},
          {"slot":7,"type":"LAB","G1":"PSLP Lab (102-B)","G2":"CS Lab (208)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "IT-C",
      "semester": 4,
      "room": "303",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"TW"},
          {"slot":2,"type":"THEORY","subject":"TOC"},
          {"slot":3,"type":"THEORY","subject":"C&S"},
          {"slot":4,"type":"THEORY","subject":"JAVA"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TOC"},
          {"slot":7,"type":"THEORY","subject":"PSLP"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"C&S"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"THEORY","subject":"JAVA"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PSLP Lab (102-B)","G2":"CS Lab (208)"},
          {"slot":7,"type":"LAB","G1":"PSLP Lab (102-B)","G2":"CS Lab (208)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"TW"},
          {"slot":2,"type":"THEORY","subject":"DBMS"},
          {"slot":3,"type":"THEORY","subject":"C&S"},
          {"slot":4,"type":"THEORY","subject":"TOC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"JAVA Lab (102-C)","G2":"DBMS Lab (102-B)"},
          {"slot":7,"type":"LAB","G1":"JAVA Lab (102-C)","G2":"DBMS Lab (102-B)"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"LAB","G1":"JAVA Lab (102-C)","G2":"DBMS Lab (102-B)"},
          {"slot":2,"type":"LAB","G1":"JAVA Lab (102-C)","G2":"DBMS Lab (102-B)"},
          {"slot":3,"type":"THEORY","subject":"JAVA"},
          {"slot":4,"type":"THEORY","subject":"DBMS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PSLP"},
          {"slot":7,"type":"THEORY","subject":"C&S"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"LAB","G1":"PSLP Lab (102-C)","G2":"CS Lab (208)"},
          {"slot":2,"type":"LAB","G1":"PSLP Lab (102-C)","G2":"CS Lab (208)"},
          {"slot":3,"type":"THEORY","subject":"TOC"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"DBMS"},
          {"slot":7,"type":"THEORY","subject":"JAVA"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    /* ===================== IT 6th SEM ===================== */

    {
      "section": "IT-A",
      "semester": 6,
      "room": "304",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"WT (304)"},
          {"slot":2,"type":"THEORY","subject":"PME (304)"},
          {"slot":3,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI&ML Lab (102-A)"},
          {"slot":4,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI&ML Lab (102-A)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PIP Lab (102-A)","G2":"WT Lab (102-B)"},
          {"slot":7,"type":"LAB","G1":"PIP Lab (102-A)","G2":"WT Lab (102-B)"},
          {"slot":8,"type":"THEORY","subject":"PIP (304)"},
          {"slot":9,"type":"THEORY","subject":"AIML (304)"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"PIP (304)"},
          {"slot":2,"type":"THEORY","subject":"PME (304)"},
          {"slot":3,"type":"THEORY","subject":"DMD (304)"},
          {"slot":4,"type":"LAB","G1":"SPM (304)","G2":"SSMDA (310)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"SMMM (304)"},
          {"slot":7,"type":"THEORY","subject":"WT (304)"},
          {"slot":8,"type":"THEORY","subject":"AI (303)"},
          {"slot":9,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI Lab (102-C)"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"SMMM (304)"},
          {"slot":2,"type":"THEORY","subject":"DMD (304)"},
          {"slot":3,"type":"LAB","G1":"PIP Lab (102-A)","G2":"WT Lab (102-B)"},
          {"slot":4,"type":"LAB","G1":"PIP Lab (102-A)","G2":"WT Lab (102-B)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"SPM (304)"},
          {"slot":7,"type":"THEORY","subject":"WT (304)"},
          {"slot":8,"type":"THEORY","subject":"AI (301)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"UHV (304)"},
          {"slot":2,"type":"THEORY","subject":"DMD (304)"},
          {"slot":3,"type":"LAB","G1":"SMMM Lab (102-A)","G2":"SPM Lab (102-C)"},
          {"slot":4,"type":"LAB","G1":"SSMDA Lab (313-B)","G2":"AI&ML Lab (102-B)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PME (304)"},
          {"slot":7,"type":"THEORY","subject":"SPM (304)"},
          {"slot":8,"type":"THEORY","subject":"SSMDA (301)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"PIP (304)"},
          {"slot":2,"type":"THEORY","subject":"DMD (304)"},
          {"slot":3,"type":"LAB","G1":"SMMM Lab (102-A)","G2":"SPM Lab (102-C)"},
          {"slot":4,"type":"LAB","G1":"SMMM Lab (102-A)","G2":"SPM Lab (102-C)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"SSMDA Lab (313-A)","G2":"SSMDA Lab (313-A)"},
          {"slot":7,"type":"THEORY","subject":"SMMM (304)"},
          {"slot":8,"type":"THEORY","subject":"LIB"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "IT-B",
      "semester": 6,
      "room": "309",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"WT (309)"},
          {"slot":2,"type":"THEORY","subject":"PIP (309)"},
          {"slot":3,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI&ML Lab (102-A)"},
          {"slot":4,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI&ML Lab (102-A)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PIP Lab (102-C)","G2":"PIP Lab (102-C)"},
          {"slot":7,"type":"THEORY","subject":"PME (309)"},
          {"slot":8,"type":"THEORY","subject":"AIML (304)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"PIP (309)"},
          {"slot":2,"type":"THEORY","subject":"DMD (309)"},
          {"slot":3,"type":"LAB","G1":"SMMM Lab (102-B)","G2":"SPM Lab (102-C)"},
          {"slot":4,"type":"LAB","G1":"SMMM Lab (102-B)","G2":"SPM Lab (102-C)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PME (309)"},
          {"slot":7,"type":"THEORY","subject":"WT (309)"},
          {"slot":8,"type":"THEORY","subject":"AI (303)"},
          {"slot":9,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI Lab (102-C)"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"SMMM (309)"},
          {"slot":2,"type":"THEORY","subject":"DMD (309)"},
          {"slot":3,"type":"LAB","G1":"PIP Lab (102-C)","G2":"WT Lab (313-B)"},
          {"slot":4,"type":"LAB","G1":"PIP Lab (102-C)","G2":"WT Lab (313-B)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"SPM (309)"},
          {"slot":7,"type":"THEORY","subject":"WT (309)"},
          {"slot":8,"type":"THEORY","subject":"AI (301)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"PIP (309)"},
          {"slot":2,"type":"THEORY","subject":"DMD (309)"},
          {"slot":3,"type":"LAB","G1":"SSMDA Lab (313-B)","G2":"AI&ML Lab (102-B)"},
          {"slot":4,"type":"LAB","G1":"SSMDA Lab (313-B)","G2":"AI&ML Lab (102-B)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"UHV (309)"},
          {"slot":7,"type":"THEORY","subject":"SPM (309)"},
          {"slot":8,"type":"THEORY","subject":"SSMDA (301)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"PME (309)"},
          {"slot":2,"type":"THEORY","subject":"DMD (309)"},
          {"slot":3,"type":"LAB","G1":"SMMM Lab (102-B)","G2":"SPM Lab (313-B)"},
          {"slot":4,"type":"LAB","G1":"SMMM Lab (102-B)","G2":"SPM Lab (313-B)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"SSMDA Lab (313-A)","G2":"SSMDA Lab (313-A)"},
          {"slot":7,"type":"THEORY","subject":"SPM (309)"},
          {"slot":8,"type":"THEORY","subject":"SMMM (309)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    {
      "section": "IT-C",
      "semester": 6,
      "room": "310",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"WT (310)"},
          {"slot":2,"type":"THEORY","subject":"DMD (310)"},
          {"slot":3,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI&ML Lab (102-A)"},
          {"slot":4,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI&ML Lab (102-A)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PIP Lab (313-A)","G2":"WT Lab (313-B)"},
          {"slot":7,"type":"LAB","G1":"PIP Lab (313-A)","G2":"WT Lab (313-B)"},
          {"slot":8,"type":"THEORY","subject":"PME (310)"},
          {"slot":9,"type":"THEORY","subject":"AIML (304)"}
        ],
        "Tuesday": [
          {"slot":1,"type":"LAB","G1":"PIP Lab (102-B)","G2":"WT Lab (313-B)"},
          {"slot":2,"type":"LAB","G1":"PIP Lab (102-B)","G2":"WT Lab (313-B)"},
          {"slot":3,"type":"LAB","G1":"SMMM Lab (102-A)","G2":"SPM Lab (110)"},
          {"slot":4,"type":"LAB","G1":"SMMM Lab (102-A)","G2":"SPM Lab (110)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PIP (310)"},
          {"slot":7,"type":"THEORY","subject":"WT (310)"},
          {"slot":8,"type":"THEORY","subject":"AI (303)"},
          {"slot":9,"type":"LAB","G1":"AI Lab (102-C)","G2":"AI Lab (102-C)"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"SMMM (310)"},
          {"slot":2,"type":"THEORY","subject":"DMD (310)"},
          {"slot":3,"type":"THEORY","subject":"PME (310)"},
          {"slot":4,"type":"THEORY","subject":"UHV (310)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"SPM (310)"},
          {"slot":7,"type":"THEORY","subject":"WT (310)"},
          {"slot":8,"type":"THEORY","subject":"AI (301)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"SPM (310)"},
          {"slot":2,"type":"THEORY","subject":"DMD (310)"},
          {"slot":3,"type":"LAB","G1":"SSMDA Lab (313-B)","G2":"AI&ML Lab (102-B)"},
          {"slot":4,"type":"LAB","G1":"SSMDA Lab (313-B)","G2":"AI&ML Lab (102-B)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PIP (310)"},
          {"slot":7,"type":"THEORY","subject":"SPM (310)"},
          {"slot":8,"type":"THEORY","subject":"SSMDA (301)"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"PIP (310)"},
          {"slot":2,"type":"THEORY","subject":"DMD (310)"},
          {"slot":3,"type":"THEORY","subject":"PME (310)"},
          {"slot":4,"type":"THEORY","subject":"SMMM (310)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"SMMM Lab (102-C)","G2":"SPM Lab (313-B)"},
          {"slot":7,"type":"LAB","G1":"SSMDA Lab (313-A)","G2":"SSMDA Lab (313-A)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },

    /* ===================== ECE 6th SEM ===================== */
    {
      "section": "ECE-A",
      "semester": 6,
      "room": "NB 201",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"LAB","G1":"DSA Lab (305)","G2":"C++ Lab (314)"},
          {"slot":2,"type":"THEORY","subject":"PME"},
          {"slot":3,"type":"THEORY","subject":"PME"},
          {"slot":4,"type":"THEORY","subject":"WSN"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"IITC"},
          {"slot":7,"type":"THEORY","subject":"DSA"},
          {"slot":8,"type":"THEORY","subject":"ML"},
          {"slot":9,"type":"THEORY","subject":"ML"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"PME"},
          {"slot":2,"type":"THEORY","subject":"IITC"},
          {"slot":3,"type":"LAB","G1":"WSN Lab (305)","G2":"EDSAD Lab (313A)"},
          {"slot":4,"type":"LAB","G1":"WSN Lab (305)","G2":"EDSAD Lab (313A)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"WSN"},
          {"slot":7,"type":"THEORY","subject":"MC"},
          {"slot":8,"type":"LAB","G1":"VHDL Lab (313A)"},
          {"slot":9,"type":"LAB","G1":"VHDL Lab (313A)"}
        ],
        "Wednesday": [
          {"slot":1,"type":"LAB","G1":"ML Lab (305)","G2":"DIP Lab (313A)"},
          {"slot":2,"type":"LAB","G1":"ML Lab (305)","G2":"DIP Lab (313A)"},
          {"slot":3,"type":"THEORY","subject":"MC"},
          {"slot":4,"type":"THEORY","subject":"MC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"MC"},
          {"slot":7,"type":"THEORY","subject":"DSA"},
          {"slot":8,"type":"LAB","G2":"OCSN Lab (316)"}
        ],
        "Thursday": [
          {"slot":1,"type":"LAB","G1":"C++ Lab (211)","G2":"DSA Lab (313B)"},
          {"slot":2,"type":"LAB","G1":"C++ Lab (211)","G2":"DSA Lab (313B)"},
          {"slot":3,"type":"THEORY","subject":"DIP"},
          {"slot":4,"type":"THEORY","subject":"VLSI"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PME"},
          {"slot":7,"type":"THEORY","subject":"C++"},
          {"slot":8,"type":"THEORY","subject":"C++"},
          {"slot":9,"type":"LAB","G1":"PIP Lab (305)"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"MC"},
          {"slot":2,"type":"THEORY","subject":"ML"},
          {"slot":3,"type":"THEORY","subject":"WSN"},
          {"slot":4,"type":"THEORY","subject":"UHV"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"IITC"},
          {"slot":7,"type":"THEORY","subject":"C++"},
          {"slot":8,"type":"THEORY","subject":"DSA"}
        ]
      }
    },
    {
      "section": "ECE-B",
      "semester": 6,
      "room": "NB 202",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"UHV"},
          {"slot":2,"type":"THEORY","subject":"PME"},
          {"slot":3,"type":"THEORY","subject":"C++"},
          {"slot":4,"type":"THEORY","subject":"ML"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"IITC"},
          {"slot":7,"type":"THEORY","subject":"DSA"},
          {"slot":8,"type":"LAB","G1":"DSA Lab (305)","G2":"C++ Lab (313B)"},
          {"slot":9,"type":"LAB","G1":"DSA Lab (305)","G2":"C++ Lab (313B)"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"IITC"},
          {"slot":2,"type":"THEORY","subject":"C++"},
          {"slot":3,"type":"LAB","G2":"ML Lab (314)"},
          {"slot":4,"type":"LAB","G2":"ML Lab (314)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"ML"},
          {"slot":7,"type":"THEORY","subject":"WSN"},
          {"slot":8,"type":"THEORY","subject":"MC"}
        ],
        "Wednesday": [
          {"slot":1,"type":"LAB","G1":"ML Lab (313B)"},
          {"slot":2,"type":"LAB","G1":"ML Lab (313B)"},
          {"slot":3,"type":"THEORY","subject":"IITC"},
          {"slot":4,"type":"THEORY","subject":"OCS&N"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"MC"},
          {"slot":7,"type":"THEORY","subject":"VHDL"},
          {"slot":8,"type":"THEORY","subject":"DSA"}
        ],
        "Thursday": [
          {"slot":1,"type":"LAB","G1":"C++ Lab (314)","G2":"C++ Lab (313)"},
          {"slot":2,"type":"LAB","G1":"C++ Lab (314)","G2":"C++ Lab (313)"},
          {"slot":3,"type":"THEORY","subject":"MC"},
          {"slot":4,"type":"THEORY","subject":"MC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"IITC"},
          {"slot":7,"type":"THEORY","subject":"SDM"},
          {"slot":8,"type":"THEORY","subject":"DSA"},
          {"slot":9,"type":"THEORY","subject":"DSA"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"ML"},
          {"slot":2,"type":"THEORY","subject":"PME"},
          {"slot":3,"type":"THEORY","subject":"ESAD"},
          {"slot":4,"type":"THEORY","subject":"UHV"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"IITC"},
          {"slot":7,"type":"THEORY","subject":"C++"},
          {"slot":8,"type":"THEORY","subject":"DSA"},
          {"slot":9,"type":"THEORY","subject":"VLSI"}
        ]
      }
    },

    /* ===================== ECE 2nd SEM ===================== */
    {
      "section": "ECE-A",
      "semester": 2,
      "room": "311",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"LAB","G1":"AP Lab (101)","G2":"LIB"},
          {"slot":2,"type":"LAB","G1":"AP Lab (101)","G2":"LIB"},
          {"slot":3,"type":"THEORY","subject":"AM"},
          {"slot":4,"type":"THEORY","subject":"AP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"EM"},
          {"slot":7,"type":"THEORY","subject":"EVS"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"AP"},
          {"slot":2,"type":"THEORY","subject":"EVS"},
          {"slot":3,"type":"THEORY","subject":"PC"},
          {"slot":4,"type":"THEORY","subject":"EM"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PC Lab (313 A)","G2":"EG Lab (8)"},
          {"slot":7,"type":"LAB","G1":"PC Lab (313 A)","G2":"EG Lab (8)"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"THEORY","subject":"LIB"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"EVS"},
          {"slot":2,"type":"THEORY","subject":"AM"},
          {"slot":3,"type":"LAB","G1":"LIB","G2":"EVS Lab (116)"},
          {"slot":4,"type":"LAB","G1":"LIB","G2":"EVS Lab (116)"},
          {"slot":5,"type":"THEORY","subject":"HVE"},
          {"slot":6,"type":"BREAK","subject":"LUNCH"},
          {"slot":7,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"LAB","G1":"EVS Lab (116)","G2":"WP Lab (9)"},
          {"slot":2,"type":"LAB","G1":"EVS Lab (116)","G2":"WP Lab (9)"},
          {"slot":3,"type":"THEORY","subject":"HVE"},
          {"slot":4,"type":"THEORY","subject":"PC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AP"},
          {"slot":7,"type":"THEORY","subject":"AM"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"PC"},
          {"slot":2,"type":"THEORY","subject":"EM"},
          {"slot":3,"type":"THEORY","subject":"LIB"},
          {"slot":4,"type":"THEORY","subject":"AM"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G2":"AP Lab (101)"},
          {"slot":7,"type":"LAB","G2":"AP Lab (101)"},
          {"slot":8,"type":"LAB","G1":"WP Lab (9)","G2":"PC Lab (313 A)"},
          {"slot":9,"type":"LAB","G1":"WP Lab (9)","G2":"PC Lab (313 A)"}
        ]
      }
    },

    /* ===================== ECE 4th SEM ===================== */
    {
      "section": "ECE-A",
      "semester": 4,
      "room": "NB 301",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"EMFT"},
          {"slot":2,"type":"THEORY","subject":"AE-II"},
          {"slot":3,"type":"THEORY","subject":"MPMC"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PSLP Lab (314)","G2":"DC Lab (305)"},
          {"slot":7,"type":"LAB","G1":"PSLP Lab (314)","G2":"DC Lab (305)"},
          {"slot":8,"type":"THEORY","subject":"TW"},
          {"slot":9,"type":"THEORY","subject":"PDP"}
        ],
        "Tuesday": [
          {"slot":1,"type":"THEORY","subject":"NAS"},
          {"slot":2,"type":"THEORY","subject":"AE-II"},
          {"slot":3,"type":"THEORY","subject":"MPMC"},
          {"slot":4,"type":"THEORY","subject":"DC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"DC Lab (305)","G2":"MPMC Lab (314)"},
          {"slot":7,"type":"LAB","G1":"DC Lab (305)","G2":"MPMC Lab (314)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"PSLP"},
          {"slot":2,"type":"THEORY","subject":"DC"},
          {"slot":3,"type":"THEORY","subject":"MPMC"},
          {"slot":4,"type":"THEORY","subject":"NAS"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"AE-II Lab (07)","G2":"PSLP Lab (314)"},
          {"slot":7,"type":"LAB","G1":"AE-II Lab (07)","G2":"PSLP Lab (314)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"DC"},
          {"slot":2,"type":"THEORY","subject":"EMFT"},
          {"slot":3,"type":"LAB","G1":"NAS Lab (203)","G2":"AE-II Lab (07)"},
          {"slot":4,"type":"LAB","G1":"NAS Lab (203)","G2":"AE-II Lab (07)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"PSLP"},
          {"slot":7,"type":"THEORY","subject":"NAS"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"AE-II"},
          {"slot":2,"type":"THEORY","subject":"PSLP"},
          {"slot":3,"type":"LAB","G1":"MPMC Lab (314)","G2":"NAS Lab (203)"},
          {"slot":4,"type":"LAB","G1":"MPMC Lab (314)","G2":"NAS Lab (203)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"EMFT"},
          {"slot":7,"type":"THEORY","subject":"TW"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },
    {
      "section": "ECE-B",
      "semester": 4,
      "room": "NB 102",
      "schedule": {
        "Monday": [
          {"slot":1,"type":"THEORY","subject":"NAS"},
          {"slot":2,"type":"THEORY","subject":"PSLP"},
          {"slot":3,"type":"LAB","G1":"MPMC Lab (314)","G2":"NAS Lab (203)"},
          {"slot":4,"type":"LAB","G1":"MPMC Lab (314)","G2":"NAS Lab (203)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"EMFT"},
          {"slot":7,"type":"THEORY","subject":"DC"},
          {"slot":8,"type":"THEORY","subject":"PDP"},
          {"slot":9,"type":"THEORY","subject":"TW"}
        ],
        "Tuesday": [
          {"slot":1,"type":"LAB","G1":"AE-II Lab (07)","G2":"PSLP Lab (314)"},
          {"slot":2,"type":"LAB","G1":"AE-II Lab (07)","G2":"PSLP Lab (314)"},
          {"slot":3,"type":"THEORY","subject":"EMFT"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"AE-II"},
          {"slot":7,"type":"THEORY","subject":"NAS"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Wednesday": [
          {"slot":1,"type":"THEORY","subject":"AE-II"},
          {"slot":2,"type":"THEORY","subject":"PSLP"},
          {"slot":3,"type":"LAB","G1":"DC Lab (305)","G2":"MPMC Lab (314)"},
          {"slot":4,"type":"LAB","G1":"DC Lab (305)","G2":"MPMC Lab (314)"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"THEORY","subject":"TW"},
          {"slot":7,"type":"THEORY","subject":"MPMC"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Thursday": [
          {"slot":1,"type":"THEORY","subject":"EMFT"},
          {"slot":2,"type":"THEORY","subject":"DC"},
          {"slot":3,"type":"THEORY","subject":"MPMC"},
          {"slot":4,"type":"THEORY","subject":"PSLP"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"NAS Lab (203)","G2":"AE-II Lab (07)"},
          {"slot":7,"type":"LAB","G1":"NAS Lab (203)","G2":"AE-II Lab (07)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ],
        "Friday": [
          {"slot":1,"type":"THEORY","subject":"MPMC"},
          {"slot":2,"type":"THEORY","subject":"NAS"},
          {"slot":3,"type":"THEORY","subject":"AE-II"},
          {"slot":4,"type":"THEORY","subject":"DC"},
          {"slot":5,"type":"BREAK","subject":"LUNCH"},
          {"slot":6,"type":"LAB","G1":"PSLP Lab (314)","G2":"DC Lab (305)"},
          {"slot":7,"type":"LAB","G1":"PSLP Lab (314)","G2":"DC Lab (305)"},
          {"slot":8,"type":"ACTIVITY","subject":"Enrichment"},
          {"slot":9,"type":"ACTIVITY","subject":"Enrichment"}
        ]
      }
    },
  ]
};

// Helper: Get available semesters
export const getSemesters = () => {
  const semesters = new Set(TIMETABLE_DATA.sections.map(s => s.semester));
  return Array.from(semesters).sort((a, b) => a - b);
};

// Helper: Get sections for a semester
export const getSectionsForSemester = (semester) => {
  return TIMETABLE_DATA.sections
    .filter(s => s.semester === semester)
    .map(s => s.section)
    .sort();
};

// Helper: Get schedule for a specific section
export const getSchedule = (semester, section) => {
  return TIMETABLE_DATA.sections.find(
    s => s.semester === semester && s.section === section
  );
};
