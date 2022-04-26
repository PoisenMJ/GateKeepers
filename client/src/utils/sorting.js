function sortCustoms(_customs){
    // input format (Object from Map):
    // [ [ key: { accepted: bool, dateCreated: date, ... , messages: [] ], ... ]

    // sort requirements:
    // latest activity
    const sorted = new Map(Object.entries(_customs)
                    .sort( ([,a], [,b]) => new Date(a.messages[a.messages.length-1].date)
                                            > new Date(b.messages[b.messages.length-1].date)));
    return sorted;
}

export { sortCustoms };