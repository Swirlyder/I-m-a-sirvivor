
module.exports = {
    why: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "Better not tell you now",
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
                before: "Concentrate and ask again",
            },
            {
                username: false,
                before: "Cannot predict now.",
            },
            {
                username: false,
                before: "Reply hazy, try again.",
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
                before: "Soon.",
            },
            {
                username: false,
                before: "Today",
            },
            {
                username: false,
                before: "Tomorrow",
            },
            {
                username: false,
                before: "This has already happened.",
            },
            {
                username: false,
                before: "When anime is good (aka never)",
            },
            {
                username: false,
                before: "NOW",
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
                before: "It is decidedly so",
            },
            {
                username: false,
                before: "Why would you even ask that?",
            },
            {
                username: false,
                before: "Signs point to yes",
            },
            {
                username: false,
                before: "My sources say no.",
            },
             {
                username: false,
                before: "Outlook not so good",
            },
             {
                username: false,
                before: "Outlook good",
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
                before: "My sources say no",
            },
            {
                username: false,
                before: "Signs point to yes.",
            },
             {
                username: false,
                before: "Without a doubt.",
            },
            {
                username: false,
                before: "My reply is no.",
            },
            {
                username: false,
                before: "Better not tell you now.",
            },
            {
                username: false,
                before: "Cannot predict now.",
            }
        ],
    },

    will: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "Don’t count on it",
            },
            {
                username: false,
                before: "As I see it, yes",
            },
            {
                username: false,
                before: "Very doubtful",
            },
            {
                username: false,
                before: "Shut up.",
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
                before: "Concentrate and ask again",
            }
        ],
    },

    who: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: true,
                before: "Are you getting tired yet,",
                after: "?",
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
                before: "Shadecession",
            },
            {
                username: false,
                before: "Not you."
            }
        ],
    },

/*    hi: 'hello',
    hello: {
        priority: 2,
        placement: "prefix",
        responses: [
            {
                username: false,
                before: "Uh... hello.",
            },
            {
                username: true,
                before: "Go away ",
                after: ".",
            },
            {
                username: false,
                before: "!",

            },
            {
                username: false,
                before: "?",

            }
        ]
    },
    */

    dosomething: {
        priority: 4,
        placement: "suffix",
        responses: [
            {
                username: true,
                before: "Why do I have to do what you want me to do ",
                after: "? Who do you think you are? You should be happy with what I am doing for you right now. I can't believe you want me to do even more for you. HA! What a joke. Can you believe this is what I have to work with?",
            },
        ],
    },

    areyou: {
        priority: 3,
        placement: "suffix",
        responses: [
            {
                username: false,
                before: "Ask again later",
            },
            {
                username: false,
                before: "Reply hazy, try again",
            },
            {
                username: true,
                before: "No, but I've heard that ",
                after: " is.",
            },
        ]
    },
};

