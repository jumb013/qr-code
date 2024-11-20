let savedUrl = '';
let qrCode = null;

function saveUrlAndSwitch() {
    const urlInput = document.getElementById('urlInput');
    if (urlInput.value) {
        savedUrl = urlInput.value;
        document.getElementById('urlDisplay').textContent = savedUrl;
        switchView();
        startQRGeneration();
    } else {
        alert('Por favor ingrese una URL válida');
    }
}

function switchView() {
    document.getElementById('urlView').classList.toggle('active');
    document.getElementById('qrView').classList.toggle('active');
    if (document.getElementById('urlView').classList.contains('active')) {
        if (qrCode) {
            clearInterval(window.qrInterval);
        }
    }
}

function generateMD5Code() {
    const timestamp = Math.floor(Date.now() / 1000);
    return CryptoJS.MD5(timestamp.toString()).toString();
}

function updateQRCode(code) {
    document.getElementById('code').textContent = code;

    // Actualizar codigo en BD
    var jsondata = { "code": code};
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://test01-5842.restdb.io/rest/codes/673bca64050c58540001ba0c",
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "4a26242e0620030a471f46506803d65734c25",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }

    $.ajax(settings).done(function (response) {
        // console.log(response);
    });

    if (!qrCode) {
        qrCode = new QRCode(document.getElementById('qrCode'), {
            width: 256,
            height: 256,
            colorDark: "#2d3748",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    qrCode.clear();
    qrCode.makeCode(savedUrl + '?id=' + code);
}

function startQRGeneration() {
    updateQRCode(generateMD5Code());
    window.qrInterval = setInterval(() => {
        updateQRCode(generateMD5Code());
    }, 10000);
}