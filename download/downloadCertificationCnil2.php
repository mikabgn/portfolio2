<?php
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Certificat_Module2_Cnil.pdf"');
header("Content-Length: " . filesize("Certificat_Module2_Cnil.pdf"));
$fp = fopen("Certificat_Module2_Cnil.pdf", "r");
fpassthru($fp);
fclose($fp);
?>