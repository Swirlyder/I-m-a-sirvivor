module.exports = {
    why: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                usesname: false,
                before: "Because PenQuin said so.",
            },
            {
                username: false,
                before: "Why don't you ask later?",
            },
            {
                username: false,
                before: "Why not?",
            },
            {
                username: false,
                before: "Blame snap tbh",
            },
        ],
    },
    
    howmuch: {
        priority: 4,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "10 gallons worth of water",
            },
            {
                username: true,
                before: "As many tribesman as ",
                after: " has",
            },
        ],
    },
    
    howbad: {
        priority: 4,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "As bad as anime",
            },
            {
                username: true,
                before: "As bad as ",
                after: "",
            },
        ],
    },
    owo: {
        priority: 4,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "OwO What's this???",
            },
            {
                username: false,
                before: "oWo",
            },
            {
                username: false,
                before: "UwU",
            },
             {
                username: false,
                before: "Stop being a weeb.",
            },
        ],
    },
    when: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: true,
                before: "On ",
                after: "'s birthday!",
            },
            {
                username: false,
                before: "4/20/2020",
            },
            {
                username: false,
                before: "today",
            },
            {
                username: false,
                before: "Tomorrow",
            },
            {
                username: false,
                before: "This has already happened",
            },
            {
                username: false,
                before: "When anime is good (aka never)",
            },
            {
                username: false,
                before: "On April 31st",
            },
        ],
    },
    
    can: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "No",
            },
            {
                username: false,
                before: "Yes",
            },
            {
                username: false,
                before: "Probably not tbh",
            },
            {
                username: false,
                before: "why would you even ask that",
            },
        ],
    },

    am: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "No",
            },
            {
                username: false,
                before: "Yes",
            },
            {
                username: false,
                before: "why would you even ask that",
            },
        ],
    },
    should: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "No",
            },
            {
                username: false,
                before: "Yes",
            },
            {
                username: false,
                before: "Probably not tbh",
            },
            {
                username: false,
                before: "obviously not lol",
            },
        ],
    },
    
    will: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "No",
            },
            {
                username: false,
                before: "Yes",
            },
            {
                username: false,
                before: "Probably not tbh",
            },
            {
                username: false,
                before: "why would you even ask that",
            },
        ],
    },
    where: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "In survivor's plug.",
            },
            {
                username: true,
                before: "At ",
                after: "'s house",
            },
            {
                username: false,
                before: "I'm stuck in botland D:",
            }
        ],
    },
    
    who: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: true,
                before: "",
                after: "",
            },
            
            {
                username: false,
                before: "Sir Vivor",
            },
            {
                username: false,
                before: "Swirlyder",
            },
            {
                username: false,
                before: "Not you."
            }
        ],
    },
    hi: 'hello',
    hello: {
        priority: 2,
        placement: "prefix",
        responses: [
            {
                username: false,
                before: "Uh... hello o///o",
            },
            {
                username: true,
                before: "Go away ",
                after: ".",
            },
            {
                username: true,
                before: "Konichiwa ",
                after: " chan~",
            },
            {
                username: false,
                before: "**CONGRATULATIONS, YOU'VE WON** ",
     
            }
        ],
    },
    areyou: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "duh",
            },
            {
                username: false,
                before: "I hope not",
            },
            {
                username: true,
                before: "No, but I've heard that ",
                after: " is.",
            },
        ]
    },
}
