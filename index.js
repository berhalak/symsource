const { readdirSync, statSync, existsSync, readFileSync, unlinkSync, mkdirSync, rmdirSync } = require('fs')
const { join } = require('path')
const symlinkDir = require('symlink-dir')
const rimraf = require("rimraf");

function getCurrentDirectory() {
	return process.cwd();
}

function getSubDirectories(dir) {
	if (!existsSync(dir)) {
		return [];
	}
	const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())
	const allDirs = dirs(dir);
	return allDirs;
}

function checkIfHasPackageJson(dir) {
	return existsSync(join(dir, "package.json"));
}

function readPackageJson(dir) {
	const file = readFileSync(join(dir, "package.json"));
	if (file) {
		return JSON.parse(file);
	}
	return {};
}

function createFolder(dir) {
	console.log("Create folder " + dir);
	if (!existsSync(dir)) {
		mkdirSync(dir);
	}
}

function linkFolder(dir, link) {
	console.log("Link folder " + dir + " to " + link);
	symlinkDir(dir, link).then(x => console.log(x));
}

function removeFolder(dir) {
	if (!existsSync(dir)) {
		return;
	}
	console.log("Removing lib folder " + dir);
	const subDirectories = getSubDirectories(dir);
	subDirectories.forEach(subDir => {
		unlinkSync(join(dir, subDir));
	});
	rmdirSync(dir);
}


var link = function () {
	const current = getCurrentDirectory();
	console.log("Current dir " + current);
	const subDirectories = getSubDirectories(current);
	subDirectories.forEach(dir => {
		if (dir == "node_modules") {
			return;
		}
		console.log("Testing folder " + dir);
		const hasPackageJson = checkIfHasPackageJson(dir);
		if (hasPackageJson) {
			console.log("Dir " + dir + " has package json");
			const packageJson = readPackageJson(dir);
			if (packageJson.libs) {
				// for now only arrays
				packageJson.libs.forEach(lib => {
					createFolder(join(dir, "src", "libs"));
					process.chdir(join(current, dir, 'src', 'libs'));
					let libFolder = join("..", "..", "..", "libs", lib);
					linkFolder(libFolder, lib);
					process.chdir(current);
				});
			}
		}
	});
};

var unlink = function () {
	const current = getCurrentDirectory();
	const subDirectories = getSubDirectories(current);
	subDirectories.forEach(dir => {
		if (dir == "node_modules") {
			return;
		}
		const hasPackageJson = checkIfHasPackageJson(dir);
		if (hasPackageJson) {
			const packageJson = readPackageJson(dir);
			if (packageJson.libs) {
				// for now only arrays
				removeFolder(join(current, dir, "src", "libs"));
			}
		}
	});
};

exports.link = link;
exports.unlink = unlink;
