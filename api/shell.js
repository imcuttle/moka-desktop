var child_process = require('child_process')
var path = require('path')

const ipcRenderer = require('electron').ipcRenderer;


var execute = (addon, cwd, callback) => {
	const cp = child_process.exec(`moka ${addon}`, {cwd: cwd}, (error, stdout, stderr) => {
	  callback && callback(error, stdout, stderr)
	  var i = processes.findIndex(x=>x.pid==cp.pid);
	  i>=0 && processes.splice(i, 1);
	  if (error) {
	    console.error(error);
	    return;
	  }
	  console.log(`stdout: ${stdout}`);
	  console.log(`stderr: ${stderr}`);
	});
	processes.push(cp);
	return cp;
}

// var processes = []


function kill(pid) {

	var i = processes.findIndex(x=>x.pid==pid);
	if(i>=0) {
		ipcRenderer.send('splice-process', i)
		processes[i].kill('SIGINT');
		processes.splice(i, 1);
	}
}

module.exports = {
	shell: execute,
	spawn: (args, cwd, callback)=>{
		const cp = child_process.fork(path.join(__dirname, 'moka.js'), args, {
			cwd: cwd, 
			stdio: [
		      0, // Use parents stdin for child
		      'pipe', // Pipe child's stdout to parent
		      'pipe', // Direct child's stderr to a file
		      'ipc'
		    ]
		});
		cp.on('close', ()=>{
			callback && callback();
			ipcRenderer.send('process-remove', cp.pid)
		})
		cp.on('error', (err)=>{
			callback && callback(err);
			ipcRenderer.send('process-remove', cp.pid)
		})
		cp.on('exit', ()=>{
			callback && callback();
			ipcRenderer.send('process-remove', cp.pid)
		})
		console.log('push', cp.pid)
		ipcRenderer.send('process-push', cp)
		return cp;
	},
	getProcesses: ()=>{return processes}
}

/*process.on('exit', () => {
  console.log('process quit', processes)
  processes.forEach(proc=>proc.kill('SIGINT'))
})

process.on('disconnect', () => {
	debugger;
  console.log('process disconnect', processes)
  processes.forEach(proc=>proc.kill('SIGINT'))
})*/
