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
    }

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
