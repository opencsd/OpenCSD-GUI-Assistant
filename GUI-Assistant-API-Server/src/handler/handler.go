package storagehandler

import (
	"net/http"
	"fmt"
	"bufio"
	"os/exec"
)

func CreateOpenCSDHandler(w http.ResponseWriter, r *http.Request) {
	dbms_name := r.URL.Query().Get("dbname")

	CmdExec("/usr/local/bin/kubectl create ns "+dbms_name)

	CmdExec("cp /mnt/instance-deploy/opencsd/*.yaml /mnt/instance-deploy/opencsd/tmp")
	CmdExec("cp /mnt/instance-deploy/opencsd/*.sh /mnt/instance-deploy/opencsd/tmp")
	CmdExec("sed -i 's/OPENCSD_NAMESPACE/"+dbms_name+"/g' /mnt/instance-deploy/opencsd/tmp/*.yaml")
	CmdExec("sed -i 's/OPENCSD_NAMESPACE/"+dbms_name+"/g' /mnt/instance-deploy/opencsd/tmp/*.sh")

	CmdExec("bash /mnt/instance-deploy/opencsd/tmp/docker_secret.sh")
	CmdExec("/usr/local/bin/kubectl create -f /mnt/instance-deploy/opencsd/tmp/.")

	CmdExec("rm /mnt/instance-deploy/opencsd/tmp/*")

	w.Write([]byte("[OpenCSD] Completed\n"))
}

func CreateMySQLHandler(w http.ResponseWriter, r *http.Request) {
	dbms_name := r.URL.Query().Get("dbname")

	CmdExec("/usr/local/bin/kubectl create ns "+dbms_name)

	CmdExec("cp /mnt/instance-deploy/mysql/*.yaml /mnt/instance-deploy/mysql/tmp")
	CmdExec("cp /mnt/instance-deploy/mysql/*.sh /mnt/instance-deploy/mysql/tmp")
	CmdExec("sed -i 's/MYSQL_NAMESPACE/"+dbms_name+"/g' /mnt/instance-deploy/mysql/tmp/*.yaml")
	CmdExec("sed -i 's/MYSQL_NAMESPACE/"+dbms_name+"/g' /mnt/instance-deploy/mysql/tmp/*.sh")

	CmdExec("bash /mnt/instance-deploy/mysql/tmp/docker_secret.sh")
	CmdExec("/usr/local/bin/kubectl create -f /mnt/instance-deploy/mysql/tmp/.")

	CmdExec("rm /mnt/instance-deploy/mysql/tmp/*")

	w.Write([]byte("[MYSQL] Completed\n"))
}

func CmdExec(cmdStr string) error{
	cmd := exec.Command("bash", "-c", cmdStr)
	stdoutReader, _ := cmd.StdoutPipe()
	stdoutScanner := bufio.NewScanner(stdoutReader)
	go func() {
		for stdoutScanner.Scan() {
			fmt.Println(stdoutScanner.Text())
		}
	}()
	stderrReader, _ := cmd.StderrPipe()
	stderrScanner := bufio.NewScanner(stderrReader)
	go func() {
		for stderrScanner.Scan() {
			fmt.Println(stderrScanner.Text())
		}
	}()
	err := cmd.Start()
	if err != nil {
		fmt.Printf("Error : %v \n", err)
	}
	err = cmd.Wait()
	if err != nil {
		fmt.Printf("Error: %v \n", err)
	}

	return nil
}