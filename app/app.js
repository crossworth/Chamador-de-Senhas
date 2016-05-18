var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var io = require('socket.io')();
var Datastore = require('nedb');
var db = new Datastore({ filename: 'resources/app/database/data.dat', autoload: true });
const dialog = require('electron').dialog;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var senha_window = null;

function dialogMessage(message) {
  var buttons = ['OK'];
  dialog.showMessageBox({ type: 'info', buttons: buttons, message: message }, function (buttonIndex) {});
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    nodeIntegration: false
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');


//  mainWindow.openDevTools();


  io.on('connection', function(socket){

    db.find({status: "chamado"}).sort({ date: 1 }).exec(function (err, result) {
      io.emit('update lista chamados', {
        lista: result
      });
    });

    db.find({status: "comparecido"}).sort({ date: 1 }).exec(function (err, result) {
      io.emit('update lista comparecido', {
        lista: result
      });
    });

    socket.on('senha chama_numero', function (payload) {
        io.emit('senha chama_numero', {
          numero: payload.numero
        });

        db.find({ id: payload.numero.toString() }, function (err, result) {
          if (result.length < 1) {
            db.insert({id: payload.numero.toString(), status: "chamado", date: Date.now().toString()}, function(err) {
              if (err) {
                dialogMessage("Erro ao inserir no banco de dados");
              }
            });
          }
        });
    });

    socket.on('senha confirma_comparecimento', function (payload) {
      db.update({ id: payload.numero.toString()}, {  $set: { status: 'comparecido' } }, {}, function (err, numReplaced) {});
    });

    socket.on('apagar database', function (payload) {
        var options = {
             title: 'Apagar Banco de Dados',
             type: 'question',
             buttons: [ 'Sim', 'Não'],
             message: 'Você tem certeza que deseja apagar o banco de dados?',
             detail: 'Esta opção não tem retorno!'
         };
         dialog.showMessageBox(options, function(response) {
           if (response == 0) {
              // apaga banco de dados
              db.remove({}, { multi: true }, function (err, numRemoved) {
                if (err) {
                  dialogMessage("Erro ao apagar banco de dados de chamados")
                }
              });

              io.emit('database apagado', {});
           }

         });
    });


    socket.on('abrir janela senha', function (payload) {
        if (senha_window) {
          senha_window.destroy();
        }

        senha_window = new BrowserWindow({
          width: 1024,
          height: 768,
          center: true,
          'min-width': 500,
          'min-height': 200,
          'accept-first-mouse': true,
          'title-bar-style': 'hidden',
          nodeIntegration: false
        });

        senha_window.loadUrl('file://' + __dirname + '/senha.html');
        //senha_window.openDevTools();

        senha_window.on('closed', function() {
          senha_window = null;
        });

    });

	});
	io.listen(3131);


  mainWindow.on('closed', function() {
    if (senha_window) {
      senha_window.destroy();
      senha_window_visible = false;
    }
    mainWindow = null;
  });
});
