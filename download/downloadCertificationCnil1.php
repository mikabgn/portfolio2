<?php
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Certificat_Module1_Cnil.pdf"');
header("Content-Length: " . filesize("Certificat_Module1_Cnil.pdf"));
$fp = fopen("Certificat_Module1_Cnil.pdf", "r");
fpassthru($fp);
fclose($fp);
?>
