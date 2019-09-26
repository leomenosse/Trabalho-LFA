var nodes = new vis.DataSet();

// create an array with edges
var edges = new vis.DataSet();

// create a network
var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};

var cont = 0;
var filaCont = [];
const proxCont = () => {
    if (filaCont.length > 0) {
        return filaCont.shift();
    } else {
        return cont++;
    }
}

function deleteNode(data, callback) {
    filaCont.push(data.nodes[0]);
    filaCont.sort();
    callback(data);
}

var options = {
    physics: {
        enabled: true,
        barnesHut: {
            avoidOverlap: 0,
            centralGravity: 0
        }
    },
    interaction: {
        hover: true
    },
    edges: {
        arrows: 'to',
        smooth: {
            enabled: true,
            type: "continuous",
            roundness: 0.5
        },
        font: {
            align: "top"
        },
        length: 250
    },
    nodes: {
        color: {
            background: '#ff1493'
        },
        font: {
            size: 30,
            color: '#fff'
        }
    },
    manipulation: {
        addNode: function (data, callback) {
            let aux = proxCont();
            data.id = aux;
            data.label = "q" + aux;
            callback(data);
        },
        editNode: function (data, callback) {
            let aux = prompt("Digite 'Inicial' ou 'Final' para esse estado selecionado:", "");
            if (aux === "Inicial") {
                data.color = {
                    background: '#32CD32'
                }
            } else if (aux === "Final") {
                data.color = {
                    background: '#00BFFF'
                }
            } else {
                alert("Entrada Inválida!");
            }
            callback(data);
        },
        deleteNode: deleteNode,
        addEdge: function (data, callback) {
            var dupe = edges.get({
                filter: (item) => {
                    return (item.from == data.from && item.to == data.to && item.id != data.id);
                }
            })

            if (dupe == null) {
                data.label = prompt("Digite o valor da transição:", "");
            } else {
                data.hidden = true;

            }

            //data.label = prompt("Digite o valor da transição:", "");
            callback(data);
        },
        editEdge: function (data, callback) {
            if (confirm("Deseja mudar o valor da transição?") === true) {
                data.label = prompt("Digite o valor da transição:", "");
            }
            callback(data);
        }
    }
};
var network = new vis.Network(container, data, options);

// mouse pointer
network.on("hoverNode", function (params) {
    network.canvas.body.container.style.cursor = 'pointer';
});
network.on("blurNode", function (params) {
    network.canvas.body.container.style.cursor = 'default';
});

network.on("hoverEdge", function (params) {
    network.canvas.body.container.style.cursor = 'pointer';
});
network.on("blurEdge", function (params) {
    network.canvas.body.container.style.cursor = 'default';
});

var isPhysicsEnabled = true;
$('#fisica').click(function () {
    isPhysicsEnabled = !isPhysicsEnabled;
    network.setOptions({
        physics: isPhysicsEnabled
    });
});

////////////////////////////////////////
// undo/redo functions
////////////////////////////////////////

//initialize
let history_list_back = [];
let history_list_forward = [];

// initial data
history_list_back.push({
    nodes_his: data.nodes.get(data.nodes.getIds()),
    edges_his: data.edges.get(data.edges.getIds())
});
// event on
data.nodes.on("*", change_history_back);
data.edges.on("*", change_history_back);

function change_history_back() {
    history_list_back.unshift({
        nodes_his: data.nodes.get(data.nodes.getIds()),
        edges_his: data.edges.get(data.edges.getIds())
    });
    //reset forward history
    history_list_forward = [];
    // apply css
    css_for_undo_redo_chnage();
}

function redo_css_active() {
    $("#desfazer").css({
        "background-color": "DodgerBlue",
        color: "#fff",
        cursor: "pointer"
    });
};

function undo_css_active() {
    $("#refazer").css({
        "background-color": "DodgerBlue",
        color: "#fff",
        cursor: "pointer"
    });
};

function redo_css_inactive() {
    $("#desfazer").css({
        "background-color": "inherit",
        color: "#EBEBEB",
        cursor: "inherit"
    });
};

function undo_css_inactive() {
    $("#refazer").css({
        "background-color": "inherit",
        color: "#EBEBEB",
        cursor: "inherit"
    });
};

function css_for_undo_redo_chnage() {
    if (history_list_back.length === 1) {
        redo_css_inactive();
    } else {
        redo_css_active();
    };
    if (history_list_forward.length === 0) {
        undo_css_inactive();
    } else {
        undo_css_active();
    };
};

$(document).ready(function () {
    // apply css
    css_for_undo_redo_chnage();
});

$("#desfazer").on("click", function () {
    if (history_list_back.length > 1) {
        const current_nodes = data.nodes.get(data.nodes.getIds());
        const current_edges = data.edges.get(data.edges.getIds());
        const previous_nodes = history_list_back[1].nodes_his;
        const previous_edges = history_list_back[1].edges_his;
        // event off
        data.nodes.off("*", change_history_back);
        data.edges.off("*", change_history_back);
        // undo without events
        if (current_nodes.length > previous_nodes.length) {
            const previous_nodes_diff = _.differenceBy(
                current_nodes,
                previous_nodes,
                "id"
            );
            data.nodes.remove(previous_nodes_diff);
        } else {
            data.nodes.update(previous_nodes);
        }

        if (current_edges.length > previous_edges.length) {
            const previous_edges_diff = _.differenceBy(
                current_edges,
                previous_edges,
                "id"
            );
            data.edges.remove(previous_edges_diff);
        } else {
            data.edges.update(previous_edges);
        }
        // recover event on
        data.nodes.on("*", change_history_back);
        data.edges.on("*", change_history_back);

        history_list_forward.unshift({
            nodes_his: history_list_back[0].nodes_his,
            edges_his: history_list_back[0].edges_his
        });
        history_list_back.shift();
        // apply css
        css_for_undo_redo_chnage();
    }
});

$("#refazer").on("click", function () {
    if (history_list_forward.length > 0) {
        const current_nodes = data.nodes.get(data.nodes.getIds());
        const current_edges = data.edges.get(data.edges.getIds());
        const forward_nodes = history_list_forward[0].nodes_his;
        const forward_edges = history_list_forward[0].edges_his;
        // event off
        data.nodes.off("*", change_history_back);
        data.edges.off("*", change_history_back);
        // redo without events
        if (current_nodes.length > forward_nodes.length) {
            const forward_nodes_diff = _.differenceBy(
                current_nodes,
                forward_nodes,
                "id"
            );
            data.nodes.remove(forward_nodes_diff);
        } else {
            data.nodes.update(forward_nodes);
        }
        if (current_edges.length > forward_edges.length) {
            const forward_edges_diff = _.differenceBy(
                current_edges,
                forward_edges,
                "id"
            );
            data.edges.remove(forward_edges_diff);
        } else {
            data.edges.update(forward_edges);
        }
        // recover event on
        data.nodes.on("*", change_history_back);
        data.edges.on("*", change_history_back);
        history_list_back.unshift({
            nodes_his: history_list_forward[0].nodes_his,
            edges_his: history_list_forward[0].edges_his
        });
        // history_list_forward
        history_list_forward.shift();
        // apply css
        css_for_undo_redo_chnage();
    }
});