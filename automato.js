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