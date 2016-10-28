var child_process = require('child_process')
var path = require('path')

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

var processes = []


function kill(pid) {
	var i = processes.findIndex(x=>x.pid==pid);
	if(i>=0) {
		processes[i].kill('SIGHUP');
		processes.splice(i, 1);
	}
}

module.exports = {
	shell: execute,
	spawn: (args, cwd, callback)=>{
		const cp = child_process.fork(path.join(__dirname, 'moka.js'), args, {cwd: cwd, 
			stdio: [
		      0, // Use parents stdin for child
		      'pipe', // Pipe child's stdout to parent
		      'pipe', // Direct child's stderr to a file
		      'ipc'
		    ]
		});
		cp.on('close', ()=>{
			callback && callback();
			kill(cp.pid)
		})
		cp.on('error', (err)=>{
			callback && callback(err);
			kill(cp.pid)
		})
		cp.on('exit', ()=>{
			callback && callback();
			kill(cp.pid)
		})
		processes.push(cp);
		return cp;
	},
	getProcesses: ()=>{return processes}
}


